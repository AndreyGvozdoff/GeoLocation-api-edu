'use strict';
const express = require('express');
const path = require('path');
const config = require('./libs/config');
const log = require('./libs/log')(module);
const oauth2 = require('./libs/oauth2');

const app = express();

app.use(passport.initialize());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
require('./routes')(app);
require('./routes/users')(app);
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res) {
    res.status(404);
    log.debug('Not found URL: %s', req.url);
    res.send({error: 'Not found'});
    return;
});

app.use(function (err, req, res) {
    res.status(err.status || 500);
    log.error('Internal error(%d): %s', res.statusCode, err.message);
    res.send({error: err.message});
    return;
});

app.get('/ErrorExample', function (req, res, next) {
    next(new Error('Random error!'));
});

app.listen(config.get('port'), function () {
    log.info('Express server listening on port ' + config.get('port'));
});

require('./libs/auth');
app.post('/oauth/token', oauth2.token);

app.get('/api/userInfo',
    passport.authenticate('bearer', { session: false }),
    function(req, res) {
        res.json({ user_id: req.user.userId, name: req.user.username, scope: req.authInfo.scope })
    }
);