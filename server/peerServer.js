const { ExpressPeerServer } = require("peer");
const express = require("express");

const peerApp = express();

module.exports = {
  ExpressPeerServer,
  peerApp
};