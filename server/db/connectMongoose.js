'use strict';
const mongoose    = require('mongoose');
const config      = require('../config/config');

mongoose.connect(config.get('mongoose:uri'));

module.exports = mongoose;