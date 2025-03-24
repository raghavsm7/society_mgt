const GuestEntry = require('../models/GuestEntry');
const User = require('../models/User');
const { sendNotification } = require('../utils/notifications');
const { validationResult } = require('express-validator');
const express = require('express');
const bodyParser = require('body-parser');
const qrcode = require('qrcode');
const crypto = require('crypto');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const { sendPushNotification } = require('../utils/notificationService');

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);


exports.createGuestEntry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const guestEntry = new GuestEntry({
      ...req.body,
      residentId: req.user._id,
      societyCode: req.user.societyCode
    });

    await guestEntry.save();

    // Notify guards
    const guards = await User.find({
      societyCode: req.user.societyCode,
      role: 'guard'
    });

    guards.forEach(guard => {
      if (guard.fcmToken) {
        sendNotification(guard.fcmToken, 'New Guest Entry', 
          `New guest expected for ${req.user.flatNo}`);
      }
    });

    res.status(201).json(guestEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Function to generate a 5-digit code
// function generateFiveDigitCode() {
//     return Math.floor(10000 + Math.random() * 90000).toString();
// }

// Endpoint to create a guest entry
exports.gatepass = async (req, res) => {
    try { 
        const { guestName, visitDateTime} = req.body; 

        if (!guestName || !visitDateTime) {
            return res.status(400).json({ 
                error: 'Guest name and date/time are required.' 
            });
        }

        const allowedFormats = ['YYYY-MM-DD', 'DD-MM-YYYY', 'DD/MM/YYYY'];
        let parsedDate;

        for (const format of allowedFormats) {
          const date = dayjs(visitDateTime, format, true).tz('Asia/Kolkata', true);;
          if (date.isValid()) {
              parsedDate = date;
              break;
          }
        }

        if (!parsedDate) {
          return res.status(400).json({
            error: 'Invalid date format. Use "YYYY-MM-DD" or "DD-MM-YYYY"'
          })
        }

        // Generate a 5-digit unique code
        // const code = generateFiveDigitCode();
        let code;
        do {
          code = Math.floor(10000 + Math.random() * 90000).toString();
        } while (await GuestEntry.exists({ code }));

        // Create data for the QR code
        const qrData = new GuestEntry({
            guestName,
            visitDateTime: parsedDate.format('YYYY-MM-DD HH:mm:ss'),
            code,
            createdBy: req.user._id,
            flatNo: req.user.flatNo
        });

        await qrData.save();

        // Respond with the 5-digit code
        res.status(201).json({
            message: 'Guest entry created successfully.',
            guestDetails: {
                guestName,
                visitDateTime: parsedDate.format('YYYY-MM-DD HH:mm:ss'),
                code
            }
        });

    } catch (error) {
        console.error('Error creating guest entry:', error);
        res.status(500).json({ error: 'An error occurred while creating the guest entry.' });
    }
};

exports.getGuestEntryByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const guestEntries = await GuestEntry.find({createdBy: userId})
    .populate('createdBy', 'name flatNo')
    .select('guestName qrCodeImage visitDateTime status checkIn code');

    if(!guestEntries || guestEntries.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No guest entries found for the logged-in user'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Guest Entry by user retrieved successfully.',
      data: guestEntries,
    });
  } catch (error) {
    console.error('Error fetching guest entries :', error);
    res.status(500).json({ error: 'An error occurred while creating the guest entry.' });
}
};

exports.verifyCode = async (req, res) => {
  try {
    const {code} = req.body;

    if(!code) {
      return res.status(400).json({
        success: false,
        message: 'Code not found'
      })
    }

    const guestEntry = await GuestEntry.findOne({code: code})

    if(!guestEntry) {
      return res.status(404).json({
        success: false,
        message: 'Guest entry not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Guest entry verified successfully',
      data: guestEntry
    })

  } catch (error) {
    console.error('Error at verifying code for guest entry:', error); 
    res.status(500).json({ error: 'An error occurred while verifying the guest entry.' });
}
}

exports.allowedGuests = async (req, res) => {
  try {

    const {entryId} = req.params;

    if(!entryId) {
      return res.status(400).json({
        success: false,
        message: 'Entry id not found'
      })
    }

    const user = await GuestEntry.findById(entryId);

    if(!user) {
      return res.status(404).json({
        success: false,
        message: 'Guest entry not found'
      })
    }

    user.status = "approved";
    await user.save();

    const resident = await User.findOne({_id: user.createdBy});

    if(!resident) {
      return res.status(400).json({
        success: false,
        message: 'Resident not found'
      })
    }

    // if (resident && resident.pushToken) {
    //   sendPushNotification(resident.pushToken, 'Guest Entry Approved', `Your guest entry for ${user.guestName} has been approved.`);
    // }

    if (resident && resident.pushToken) {
      await sendPushNotification(
        resident.pushToken,
        'Guest Entry Approved',
        `Your guest entry for ${user.guestName} has been approved.`
      )
    }

    return res.status(200).json({
      success: true,
      message: 'Guest entry allowed successfully',
      data: user
    })
  } catch (error) {
    console.error('Error at allowing guest for entry:', error); 
    res.status(500).json({ error: 'An error occurred while allowing guest for entry' });
}
}

exports.disallowingGuests = async (req, res) => {
  try {

    const {entryId} = req.params;

    if(!entryId) {
      return res.status(400).json({
        success: false,
        message: 'Entry id not found'
      })
    }

    const user = await GuestEntry.findById(entryId);

    if(!user) {
      return res.status(404).json({
        success: false,
        message: 'Guest entry not found'
      })
    }

    user.status = "cancelled";
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Guest entry disallowed successfully',
      data: user
    })
  } catch (error) {
    console.error('Error at disallowing guest for entry:', error); 
    res.status(500).json({ error: 'An error occurred while disallowing guest for entry' });
}
}

// Endpoint to fetch all guest entries
exports.getAllGuestEntries = async (req, res) => {
  try {
      // Fetch all guest entries from the database
      const guestEntries = await GuestEntry.find()
              .populate('createdBy', 'name flatNo')

      // Check if there are no records
      if (!guestEntries.length) {
          return res.status(404).json({
              success: false,
              message: "No guest entries found.",
          });
      }

      // Respond with guest entry data
      res.status(200).json({
          success: true,
          message: "Guest entries fetched successfully.",
          data: guestEntries
      });

  } catch (error) {
      console.error("Error fetching guest entries:", error);
      res.status(500).json({
          success: false,
          message: "An error occurred while fetching guest entries.",
          error: error.message
      });
  }
};

exports.updateGuestEntry = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['status', 'checkIn', 'checkOut'];
    
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates!' });
    }

    const guestEntry = await GuestEntry.findOne({
      _id: req.params.entryId,
      societyCode: req.user.societyCode
    });

    if (!guestEntry) {
      return res.status(404).json({ error: 'Guest entry not found' });
    }

    updates.forEach(update => guestEntry[update] = req.body[update]);
    
    if (req.body.status === 'approved') {
      guestEntry.approvedBy = req.user._id;
    }

    await guestEntry.save();

    // Notify resident if guard updates the entry
    if (req.user.role === 'guard') {
      const resident = await User.findById(guestEntry.residentId);
      if (resident.fcmToken && resident.notificationSettings.guardNotifications) {
        sendNotification(resident.fcmToken, 'Guest Entry Update',
          `Your guest entry has been ${guestEntry.status}`);
      }
    }

    res.json(guestEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};