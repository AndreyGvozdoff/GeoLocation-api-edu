'use strict';
const crypto = require('crypto');
const mongoose    = require('./connectMongoose');
const log         = require('././log')(module);

const db = mongoose.connection;

db.on('error', function (err) {
    log.error('Connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});