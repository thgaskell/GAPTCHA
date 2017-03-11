
'use strict';

const express = require('express');
const router = express.Router();
const M2X = require('m2x');
const m2x = new M2X(process.env.M2X_KEY);

const deviceID = "8b492694122cc040401c2d4f9a6a3b56";

router.route('/')
  // GET the current check-point streeam status
  .get((req, res) => {
    m2x.devices.values(deviceID, "check-points", (values) => {
      res.send(values);
    });
  })
  // Make an update to the stream
  .put((req, res) => {
    let payload = {
      value: JSON.stringify({
        lat: 123,
        lon: 456,
        active: false,
        createdAt: Date.now(),
      })
    };
    m2x.devices.setStreamValue(deviceID, "check-points", payload, (values) => {
      res.send(values);
    });
  })


module.exports = router;
