const express = require('express');
const app = express();
const M2X = require('m2x');
const Promise = require('bluebird');
const m2x = new M2X(process.env.M2X_KEY);

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const host = isDeveloping ? 'localhost' :  '0.0.0.0';

const onStart = (err) => {
  if (err) {
    throw new Error(err);
  }
  console.info(
    `==> 🌎 Listening on port ${port}. ` +
    `Open up http://${host}:${port}/ in your browser.`
  );
};

app.listen(port, host, onStart);
