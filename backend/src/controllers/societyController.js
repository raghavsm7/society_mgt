const Society = require('../models/Society');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { sendPushNotification } = require('../utils/notificationService');

exports.createSociety = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if societyCode is properly passed
    if (!req.body.societyCode) {
      return res.status(400).json({ error: 'societyCode is required' });
    }

    // Log the request body to debug
    console.log("Request Body:", req.body);

    // Check if societyCode already exists
    const existingSociety = await Society.findOne({ societyCode: req.body.societyCode });
    if (existingSociety) {
      return res.status(400).json({ error: 'societyCode must be unique' });
    }

    // Create a new society
    const society = new Society(req.body);
    await society.save();

    res.status(201).json(society);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(400).json({ error: error.message });
  }
};

exports.getSocieties = async (req, res) => {
  try {
    const societies = await Society.find({}); // Fetch all societies
    res.json(societies);
  } catch (error) {
    console.error("Error fetching societies:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getSocietyByCode = async (req, res) => {
  try {
    const { societyCode } = req.params; // Extract societyCode from URL parameter
    console.log("Society Code:", societyCode);

    // Query the database using the societyCode field
    const society = await Society.findOne({ societyCode: societyCode });
console.log("society data",society)
    // If no society is found, return a 404 error
    if (!society) {
      return res.status(404).json({ message: "Society not found" });
    }

    // Return the found society as a response
    res.json(society);
  } catch (error) {
    console.error("Error fetching society:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
};



exports.updateSociety = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    // const allowedUpdates = ['name', 'address', 'reraNumber', 'contactDetails', 
    //                        'subscriptionEndDate', 'committeeMembers', 'settings'];
    const allowedUpdates=['name','societyCode','address','subscriptionEndDate'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates!' });
    }
    const id = req.params.id;
    console.log(id,"socity id")
    const society = await Society.findById(id)
;
    console.log(society,"+========")

    if (!society) {
      return res.status(404).json({ error: 'Society not found' });
    }

    updates.forEach(update => society[update] = req.body[update]);
    await society.save();

    res.json(society);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getresidents = async (req, res) => {
  try {
    const { societyCode } = req.params; // Get societyCode from request params

    // Log to confirm that the societyCode is being passed correctly
    console.log("Received societyCode:", societyCode);

    // Check if societyCode exists and is valid
    if (!societyCode) {
      return res.status(400).json({ success: false, message: "Society code is required" });
    }

    // Fetch all users with role 'resident' and matching societyCode
    const residents = await User.find({
      societyCode: societyCode,
      // role: 'resident',
      role: {$in: ['resident', 'guard']},
    }).select('-password'); // Exclude sensitive data like password

    // Check if residents were found
    if (residents.length === 0) {
      return res.status(404).json({
        success: true,
        residents: [],
        message: "No residents or guards found for this society",
      });
    }

    // Log the residents data to check if it's correctly fetched
    // console.log("Residents data:", residents);

    // Send the successful response
    res.json({ success: true, residents });
  } catch (error) {
    // Log the error and send a response
    console.error("Error fetching residents:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getcommittemember=async(req,res)=>{
  try{
    const {societyCode}=req.params;
    console.log("society info",societyCode);
    if (!societyCode) {
      return res.status(400).json({ success: false, message: "Society code is required" });
    }
    const member = await User.find({
      societyCode: societyCode,
      role: 'committee member',
    }).select('-password');

    if (member.length === 0) {
      return res.status(404).json({
        success: true,
        member: [],
        message: "No committee member found for this society",
      });
    }
    console.log("data:", member);

    // Send the successful response
    res.json({ success: true, member });
  } catch (error) {
    // Log the error and send a response
    console.error("Error fetching members:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
  

exports.changerole = async (req, res) => {
  try {
    // Fetch residents and sort them with the 'isDefault' user at the top
    const residents = await User.find({ 
      societyCode: req.params.code,
      role: 'resident'
    }).sort({ isDefault: -1 }).select('-password'); // Show residents sorted by 'isDefault' first
    
    // Update role from 'user' to 'cashier' or 'committee member' and change default if needed
    if (req.body.userId && req.body.newRole) {
      const updatedUser = await User.findById(req.body.userId);
      
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Ensure the new role is either 'cashier' or 'committee member'
      if (!['cashier', 'committee member'].includes(req.body.newRole)) {
        return res.status(400).json({ error: 'Invalid role. Only "cashier" or "committee member" are allowed.' });
      }

      // Check if trying to assign 'cashier' role and if one already exists
      if (req.body.newRole === 'cashier') {
        const existingCashier = await User.findOne({ 
          societyCode: req.params.code, 
          role: 'cashier' 
        });
        
        if (existingCashier) {
          return res.status(400).json({ error: 'There can only be one cashier in the society.' });
        }
      }

      // Check if the new role is 'committee member' (no restriction on number of committee members)
      if (req.body.newRole === 'committee member') {
        // Optionally, you can add further logic if committee members should have any specific privileges or restrictions
      }

      // Change the user role to the new one (either 'cashier' or 'committee member')
      updatedUser.role = req.body.newRole;
      await updatedUser.save();

      // Now, handle the 'isDefault' flag if the updated user was default
      if (updatedUser.isDefault) {
        // Find the next resident who can become default
        const nextResident = await User.findOne({ 
          societyCode: req.params.code, 
          role: 'resident', 
          isDefault: false 
        }).sort({ name: 1 }); // Sort to find the next resident in alphabetical order (you can adjust this sorting logic if needed)

        if (nextResident) {
          nextResident.isDefault = true; // Set the next resident as default
          await nextResident.save();
        }
      }

      return res.json({ success: true, user: updatedUser });
    }

    // If no role update is requested, just return the residents list
    res.json(residents);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.societyCode !== req.params.code) {
      return res.status(403).json({ error: 'User does not belong to this society' });
    }

    user.isApproved = true;
    await user.save();

    if (user.pushToken) {
      await sendPushNotification(
        user.pushToken,
        'Account Approved',
        'Your account has been approved by the society admin!',
        {screen: 'Dashboard'} // Additional data (if needed)
      );
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.disapproveUser = async (req, res) => {
  try{
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.societyCode !== req.params.code) {
      return res.status(403).json({ error: 'User does not belong to this society' });
    }

    user.isApproved = false;
    await user.save();

    res.json({
      success: true,
      message: 'User has been disapproved',
      user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

exports.deleteSociety = async (req, res) => {
  try {
    const { id } = req.params; // Extracting id from params

   
    const society = await Society.findById(id);
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }

    // Delete the society
    await Society.findByIdAndDelete(id);

    res.status(200).json({ message: 'Society deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

