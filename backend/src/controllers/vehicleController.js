const Vehicle = require('../models/Vehicle');
const Society = require('../models/Society');
const { validationResult } = require('express-validator');

exports.addVehicle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const society = await Society.findOne({ code: req.user.societyCode });
    const userVehicles = await Vehicle.countDocuments({
      userId: req.user._id,
      isActive: true
    });

    if (userVehicles >= society.settings.vehicleLimit) {
      return res.status(400).json({ error: 'Vehicle limit reached' });
    }

    const vehicle = new Vehicle({
      ...req.body,
      userId: req.user._id,
      societyCode: req.user.societyCode
    });

    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      userId: req.params.userId || req.user._id,
      societyCode: req.user.societyCode
    });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.vehicleId,
      userId: req.user._id,
      societyCode: req.user.societyCode
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    vehicle.isActive = false;
    await vehicle.save();
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};