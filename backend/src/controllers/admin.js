const {Admin,Settings} = require('../models/admin'); // Assuming the Admin model is correctly imported
const Society = require('../models/Society');

exports.createAdmin = async (req, res) => {
  try {
    const { email, password, _id } = req.body; // Expecting `_id` from the frontend
    console.log("body", req.body);

    // Check if email, password, and _id are provided
    if (!email || !password || !_id) {
      return res.status(400).json({ error: 'Email, password, and _id are required' });
    }

    // Find the society by _id in the database
    const societymatch = await Society.findById(_id);
    if (!societymatch) {
      return res.status(404).json({ error: 'Society not found' });
    }

    // Create a new admin user with the provided details
    const user = new Admin({
      email,
      password, // Password will be hashed automatically due to pre-save hook
      role: 'society_admin', // Set the role to 'society_admin'
      societyId: _id, // Assign the user to the specified society
    });

    // Save the new user to the database
    await user.save();

    // Respond with a success message and the created user
    res.status(201).json({
      message: `New society_admin user created successfully for society: ${societymatch.name}`,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.financialpage =async (req, res) => {
  try {
    const { financialPageEnabled } = req.body;

    if (typeof financialPageEnabled !== 'boolean') {
      return res.status(400).json({
        status: false,
        message: 'financialPageEnabled must be a boolean',
      });
    }

    // Check if settings exist, otherwise create one
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({
        financialPageEnabled: financialPageEnabled,
      });
      await settings.save();
    } else {
      settings.financialPageEnabled = financialPageEnabled;
      await settings.save();
    }

    res.status(200).json({
      status: true,
      message: `Financial feature ${financialPageEnabled ? 'enabled' : 'disabled'} successfully`,
      data: settings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'Error updating financial page settings',
      error: error.message,
    });
  }
};

exports.getAdminsBySociety = async (req, res) => {
  try {
    // Fetch all admins along with their assigned society
    const admins = await Admin.find().populate("societyId", "name"); // Populating society name

    if (!admins || admins.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No admins found",
      });
    }

    // Format response to show which admin belongs to which society
    const formattedAdmins = admins.map((admin) => ({
      adminId: admin._id,
      email: admin.email,
      society: admin.societyId ? admin.societyId.name : "Society Not Found",
      role: admin.role,
    }));

    res.status(200).json({
      status: true,
      message: "Admins retrieved successfully",
      data: formattedAdmins,
    });
  } catch (error) {
    console.error("❌ Error fetching admins by society:", error);
    res.status(500).json({
      status: false,
      message: "Error fetching admins",
      error: error.message,
    });
  }
};
