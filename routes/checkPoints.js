'use strict';

const express = require('express');
const router = express.Router();
const M2X = require('m2x');
const vincenty = require('node-vincenty');
const m2x = new M2X(process.env.M2X_KEY);
const streamName = 'check-points';

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
    m2x.devices.values(deviceID, streamName, (values) => {
      res.send(values);
    });
  });

router.route('/capture/lat/:lat/long/:lon')
  // GET capture route
  .get((req, res) => {
    let masterPoint = {};
    m2x.devices.location(deviceID,(result) => {
      masterPoint.lat = result.json.latitude;
      masterPoint.lon = result.json.longitude;
      const lat = req.params.lat;
      const lon = req.params.lon;
      // NOTE: Capture range.
      const distanceThreshold = 20;
      gameCounter++;
      totalCounter++;

      vincenty.distVincenty(lat, lon, masterPoint.lat, masterPoint.lon, (distance, initialBearing, finalBearing) => {
        if( distance < distanceThreshold && distance >= 0 ){
          // TODO: DO SOMETHING BETTER
          res.json({
            success: true,
            message: 'GOTTEM! It took a total of ' + gameCounter + ' total attempts since last found.',
          });
          gameCounter = 0;
        } else {
          res.json({
            success: false,
            message: 'NOPE! TRY AGAIN',
          });
        }
      });
    });
  });

router.route('/masterlocation')
  // GET device location for master point (DEVELOPMENT USE)
  // .get((req, res) => {
  //   m2x.devices.location(deviceID,(result) => {
  //     res.send(result.json);
  //   });
  // })

  // PUT updates master point to current device location specified
  .put((req, res) => {
    if( req.body.name === undefined ){
      req.body.name = "Master Point: " + Date.now();
    }
    if( req.body.elevation === undefined ){
      req.body.elevation = 17;
    }
    let newMasterPoint = { 
      "name": req.body.name,
      "latitude": req.body.lat,
      "longitude": req.body.lon,
      "timestamp": Date.UTC(),
      "elevation": req.body.elevation
    };
    m2x.devices.updateLocation(deviceID, newMasterPoint,(result) => {
      res.send(result.json);
    });
  });

router.route('/reset')
  // STUBBED FOR FUTURE GAME ADMINISTRATION
  .get((req, res) => {
    res.send('stub');
  });

router.route('/lat/:lat/long/:lon')
  // GET the current check-point id's status and returns angle direction
  .get((req, res) => {
    let masterPoint = {};
    m2x.devices.location(deviceID,(result) => {
      masterPoint.lat = result.json.latitude;
      masterPoint.lon = result.json.longitude;
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

      m2x.devices.setStreamValue(deviceID, streamName, payload, (result) => {
        console.log('result',result.json);
      });
      vincenty.distVincenty(lat, lon, masterPoint.lat, masterPoint.lon, (distance, initialBearing, finalBearing) => {
          res.json({
            finalBearing,
          });
      });
    });
  });


module.exports = router;
