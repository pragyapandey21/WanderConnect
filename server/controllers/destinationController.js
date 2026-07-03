const Destination = require("../models/Destination");

// Get all destinations
const getDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ name: 1 });

    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get one destination by name
const getDestinationByName = async (req, res) => {
  try {
    const destination = await Destination.findOne({
      name: req.params.name,
    });

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found",
      });
    }

    res.status(200).json(destination);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create destination
const createDestination = async (req, res) => {
  try {
    const destination = await Destination.create(req.body);

    res.status(201).json(destination);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createDestination,
  getDestinations,
  getDestinationByName,
};