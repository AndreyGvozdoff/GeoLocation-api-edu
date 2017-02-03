//structure change, implement promises and remove callback, implement errors handller
'use strict';
const express         = require('express');
const path            = require('path');
const config          = require('./config/config');
const log             = require('./logs/log')(module);

const app = express();

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
require('./routes/locations')(app);
require('./routes/users')(app);
app.use(express.static(path.join(__dirname, "client")));

app.use(function(req, res){
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(err, req, res){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});

app.get('/ErrorExample', function(req, res, next){
    next(new Error('Random error!'));
});

app.listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});