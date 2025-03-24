const Notice = require('../models/notice');

exports.getAllNoticesByAdmin = async (req, res) => {
  try {
    const notices = await Notice.find({ isAdmin: true }) // Fetch notices created by admins
      .populate('createdBy', 'name email') // Populate admin details (name and email)
      .sort({ createdAt: -1 }); // Sort by latest notices

    res.status(200).json({
      success: true,
      message: 'Notices fetched successfully',
      data: notices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notices',
      error: error.message,
    });
  }
};

exports.createNotice = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user; // Assume user ID comes from authentication middleware

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required',
      });
    }

    // Assume `isAdmin` status is checked via middleware or user role
    const newNotice = new Notice({
      title,
      description,
      createdBy: userId,
      isAdmin: true, // Marking as admin-created
    });

    await newNotice.save();

    res.status(201).json({
      success: true,
      message: 'Notice created successfully',
      data: newNotice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating notice',
      error: error.message,
    });
  }
};
