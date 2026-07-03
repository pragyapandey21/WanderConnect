const express = require("express");
const router = express.Router();

const {
  createDestination,
  getDestinations,
  getDestinationByName,
} = require("../controllers/destinationController");

// Get all destinations
router.get("/", getDestinations);

// Get one destination
router.get("/:name", getDestinationByName);
router.post("/", createDestination);

module.exports = router;