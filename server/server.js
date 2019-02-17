const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('morgan');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(config.database);

const clientPath = path.join(__dirname, '../client');
app.use(express.static(clientPath));
app.use('/api/posts', require('./post.route'));

app.get('*', function(req, res) {
  res.sendFile(clientPath + '/index.html');
});

// https.createServer(options, app).listen(config.port, () => {
//   console.log('Server is listening on ' + config.port);
// });

app.listen(config.port, () => {
  console.log('Server is listening on ' + config.port);
});
