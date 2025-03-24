const jwt = require('jsonwebtoken');
const User = require('../models/User');

// app.use((req, res, next) => {
//   console.log('Incoming Request:', {
//       method: req.method,
//       path: req.path,
//       body: req.body
//   });
//   next();
// });

// Middleware to add profile picture to every response
const addProfilePictureToResponse = (req, res, next) => {
  if (req.user && req.user.profilePicture) {
    res.locals.profilePicture = req.user.profilePicture; // Make profile picture available globally
  } else {
    res.locals.profilePicture = '/defaultProfilePicture.png'; // Set default profile picture if none exists
  }
  next();
};

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id });
    console.log("decoded data",decoded);

    if (!user || !user.isApproved) {
      throw new Error();
    }

    req.token = token;
    req.user_id=decoded._id;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send({ error: 'Not authorized to access this resource' });
    }
    next();
  };
};

module.exports = { auth, authorize, addProfilePictureToResponse};