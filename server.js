const express = require('express');
const app = express();
const Promise = require('bluebird');
const bodyParser = require('body-parser');
const checkpoint = require('./routes/checkPoints');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const host = isDeveloping ? 'localhost' :  '0.0.0.0';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

Promise.onPossiblyUnhandledRejection((err) => {
  throw new Error(err);
});


app.use('/api/checkpoint', checkpoint);

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
