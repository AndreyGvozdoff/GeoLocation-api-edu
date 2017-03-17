'use strict';
const nconf = require('nconf');
//
nconf.argv()
    .env();
['./server/config.json'].forEach(function(f, i) {
    nconf.file(i, f);
});

module.exports = nconf;