const GuardEntry = require('../models/GuardEntry');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { sendNotification } = require('../utils/notifications');
const { sendPushNotification } = require('../utils/notificationService');


exports.createEntry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const guardEntry = new GuardEntry({
      ...req.body,
      guardId: req.user._id,
      societyCode: req.user.societyCode
    });

    await guardEntry.save();

    // Notify society admin for incidents
    if (req.body.entryType === 'incident' || req.body.entryType === 'unknown_visitor') {
      const admins = await User.find({
        societyCode: req.user.societyCode,
        role: 'society_admin',
        'notificationSettings.pushNotifications': true
      });

      admins.forEach(admin => {
        if (admin.fcmToken) {
          sendNotification(admin.fcmToken, 
            `New ${req.body.entryType === 'incident' ? 'Security Incident' : 'Unknown Visitor'}`,
            req.body.note || 'New entry reported by guard');
        }
      });
    }

    res.status(201).json(guardEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// exports.createManualEntry = async (req, res) => {
//   try {
//     const {visitorType, name, phoneNo, flatNo, vehicleNo} = req.body;

//     if(!visitorType || !name || !phoneNo || !flatNo) {
//       return res.status(400).json({error: 'All fields are required'});
//     }

//     const manualEntry = new GuardEntry({
//       // entryType: 'manual',
//       visitorType,
//       name,
//       phoneNo,
//       flatNo,
//       vehicleNo,
//       guardId: req.user._id
//     });
//     await manualEntry.save();
//     res.status(201).json({
//       success: true,
//       message: 'Manual Entry created successfully',
//       data: manualEntry
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// }

exports.createManualEntry = async (req, res) => {
  try {
    const {visitorType, name, phoneNo, flatNo, vehicleNo, societyCode} = req.body;

    if(!visitorType || !name || !phoneNo || !flatNo || !societyCode) {
      return res.status(400).json({error: 'All fields are required'});
    }

    const manualEntry = new GuardEntry({
      // entryType: 'manual',
      visitorType,
      name,
      phoneNo,
      flatNo,
      vehicleNo,
      guardId: req.user._id,
      societyCode
    });

    await manualEntry.save();

    // Related Resident Dhundho (Jiske Flat No par visitor aaya hai)
    const resident =  await User.findOne({flatNo, societyCode, role: ['resident', 'committee member', 'society_admin', 'cashier']});

    if (!resident) {
      return res.status(400).json({
        success: false,
        message: 'Resident not found'
      })
    }

    // Notify the resident
    if (resident && resident.pushToken) {
      // Notification send kro
      await sendPushNotification(
        resident.pushToken,
        'New Visitor',
        `${name} has arrived at your flat (${flatNo}).`,
        {screen: 'Dashboard'}
      )
    }

    res.status(201).json({
      success: true,
      message: 'Manual Entry created successfully',
      data: manualEntry
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

exports.getEntries = async (req, res) => {
  try {
    const query = { societyCode: req.user.societyCode };
    
    // Date filters
    if (req.query.startDate) {
      query.createdAt = { $gte: new Date(req.query.startDate) };
    }
    if (req.query.endDate) {
      query.createdAt = { ...query.createdAt, $lte: new Date(req.query.endDate) };
    }
    
    // Entry type filter
    if (req.query.type) {
      query.entryType = req.query.type;
    }

    const entries = await GuardEntry.find(query)
      .populate('guardId', 'name')
      .sort({ createdAt: -1 });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGuardAttendance = async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    const attendanceEntries = await GuardEntry.find({
      societyCode: req.user.societyCode,
      guardId: req.params.guardId,
      entryType: { $in: ['attendance_in', 'attendance_out'] },
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: 1 });

    // Process attendance data
    const attendance = [];
    let checkIn = null;

    for (const entry of attendanceEntries) {
      if (entry.entryType === 'attendance_in') {
        checkIn = entry;
      } else if (entry.entryType === 'attendance_out' && checkIn) {
        attendance.push({
          date: checkIn.createdAt,
          checkIn: checkIn.createdAt,
          checkOut: entry.createdAt,
          duration: (entry.createdAt - checkIn.createdAt) / (1000 * 60 * 60) // hours
        });
        checkIn = null;
      }
    }

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGuardDetails = async (req, res) => {
  try {
    const guardDetails = await User.find({role: 'guard'});
    res.status(200).json({
      success: true,
      message: 'Guard details fetched successfully',
      data: guardDetails
    });
  } catch (error) {
    res.status(500).json({ message: "No guard found", error: error.message });
  }
}