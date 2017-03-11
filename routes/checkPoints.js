'use strict';

const express = require('express');
const router = express.Router();
const M2X = require('m2x');
const m2x = new M2X(process.env.M2X_KEY);

const deviceID = "8b492694122cc040401c2d4f9a6a3b56";

router.route('/')
  // GET the current check-point stream status
  .get((req, res) => {
    m2x.devices.values(deviceID, "check-points", (values) => {
      res.send(values);
    });
  })
  // Create a new game state
  .post((req, res) => {
    let payload = {
      value: JSON.stringify([
        {
          id: 1,
          name: 'Sacred Hearts',
          clue: 'The marker is on the third table to the right of the room, by the vending machine',
          createdAt: Date.now(),
        }, {
          id: 2,
          name: 'Manoa Innovatation Center',
          clue: 'The marker is in the cafeteria',
          createdAt: Date.now(),
        }, {
          id: 3,
          name: 'University of Hawaii at Manoa',
          clue: 'The marker is at a Catholic School',
          createdAt: Date.now(),
        }, {
          id: 4,
          name: 'Sacred Hearts',
          clue: 'The marker is on Oahu',
          createdAt: Date.now(),
        }, {
          id: 5,
          name: 'Sacred Hearts',
          clue: 'The marker is on NOT on the moon',
          createdAt: Date.now(),
        }, {
          id: 6,
          name: 'Master Point',
          clue: 'YOU WON!',
          lat: 21.2858534,
          lon: -157.8064349,
          active: false,
          createdAt: Date.now(),
        }
      ])
    };

    m2x.devices.setStreamValue(deviceID, "check-points", payload, (values) => {
      res.send(values);
    });
  })

router.route('/:id')
  // GET the current check-point id's status - if it's not activated - then active that checkpoint
  .get((req, res) => {

    const id = req.params.id;

    m2x.devices.values(deviceID, "check-points", (values) => {
      res.send(values);
    });
  })

module.exports = router;
