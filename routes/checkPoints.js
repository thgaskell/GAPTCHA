'use strict';

const express = require('express');
const router = express.Router();
const M2X = require('m2x');
const vincenty = require('node-vincenty');
const m2x = new M2X(process.env.M2X_KEY);

const deviceID = ( process.env.M2X_DEVICE_ID ) ? process.env.M2X_DEVICE_ID : '8b492694122cc040401c2d4f9a6a3b56'; 
let masterPoint = {
    name: 'Master Point',
    // TEST (SACRED HEARTS CAFETERIA) 21.285471, -157.807362
    lat: 21.2858534,
    lon: -157.8064349,
    active: false,
    createdAt: Date.now(),
  };
let gameCounter = 0;
let totalCounter = 0;
// NOTE: TIMES SUPERMARKET
// const testPoint = {
//     name: 'Test Point',
//     lat: 21.286615,
//     lon: -157.807592,
//     active: false,
//     createdAt: Date.now(),
//   }

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
          lat: 21.2858534,
          lon: -157.8064349,
          angle: 123,
          createdAt: Date.now(),
        }, {
          id: 2,
          name: 'Manoa Innovatation Center',
          clue: 'The marker is in the cafeteria',
          lat: 21.2858534,
          lon: -157.8064349,
          angle: 123,
          createdAt: Date.now(),
        }, {
          id: 3,
          name: 'University of Hawaii at Manoa',
          clue: 'The marker is at a Catholic School',
          lat: 21.2858534,
          lon: -157.8064349,
          angle: 123,
          createdAt: Date.now(),
        }, {
          id: 4,
          name: 'Sacred Hearts',
          lat: 21.2858534,
          lon: -157.8064349,
          angle: 123,
          clue: 'The marker is on Oahu',
          createdAt: Date.now(),
        }, {
          id: 5,
          name: 'Sacred Hearts',
          clue: 'The marker is on NOT on the moon',
          lat: 21.2858534,
          lon: -157.8064349,
          angle: 123,
          createdAt: Date.now(),
        }
      ])
    };

    m2x.devices.setStreamValue(deviceID, "check-points", payload, (values) => {
      res.send(values);
    });
  });

router.route('/capture/lat/:lat/long/:lon')
  // GET capture route
  .get((req, res) => {
    const lat = req.params.lat;
    const lon = req.params.lon;
    gameCounter++;
    totalCounter++;

    vincenty.distVincenty(lat, lon, masterPoint.lat, masterPoint.lon, (distance, initialBearing, finalBearing) => {
      // NOTE: 15m capture range.
      if( distance < 15 && distance >= 0 ){
        // TODO: DO SOMETHING BETTER
        res.send('GOTTEM! It took a total of ' + gameCounter + ' total attempts since last found.');
        gameCounter = 0;
      } else {
        res.send('NOPE! TRY AGAIN');
      }
    });
  });

router.route('/reset')
  // GET checks server master point for win condition
  .get((req, res) => {
    res.send('stub');
  });

router.route('/lat/:lat/long/:lon')
  // GET the current check-point id's status - if it's not activated - then active that checkpoint
  .get((req, res) => {

    const lat = req.params.lat;
    const lon = req.params.lon;
    gameCounter++;
    totalCounter++;
    let payload = {
      value: JSON.stringify(
        {
          // id: 'stub',
          lat: req.params.lat,
          lon: req.params.lon,
          value: 1, // NOTE: Maybe unnecessary if using a gameCounter on server.
          timestamp: Date.now(),
        }
      )
    };

    m2x.devices.setStreamValue(deviceID, "check-points", payload, (result) => {
      console.log('result',result.json);
    });
    vincenty.distVincenty(lat, lon, masterPoint.lat, masterPoint.lon, (distance, initialBearing, finalBearing) => {
        res.json({
          distance,
          finalBearing,
        });
    });
  });


module.exports = router;
