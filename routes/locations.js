'use strict';
const LocationModel    = require('../libs/mongoose').LocationModel;
module.exports = function(app){
app.get('/api', function (req, res) {
    res.send('API is running');
});


app.get('/api/location', function(req, res) {
    return LocationModel.find(function (err, locations) {
        if (!err) {
            return res.send(locations);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

app.post('/api/locations', function(req, res) {
    let location = new LocationModel({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        adress: req.body.adress,
        lat: req.body.lat,
        lng: req.body.lng,
        images: req.body.images
    });

    location.save(function (err) {
        if (!err) {
            log.info("Location created");
            return res.send({ status: 'OK', location:location });
        } else {
            if(err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
            log.error('Internal error(%d): %s',res.statusCode,err.message);
        }
    });
});

app.get('/api/locations/:id', function(req, res) {
    return LocationModel.findById(req.params.id, function (err, location) {
        if(!location) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        if (!err) {
            return res.send({ status: 'OK', location:location });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

app.put('/api/locations/:id', function (req, res){
    return LocationModel.findById(req.params.id, function (err, location) {
        if(!location) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        location.title = req.body.title;
        location.description = req.body.description;
        location.author = req.body.author;
        location.adress = req.body.adress, 
        location.lat = req.body.lat,
        location.lng = req.body.lng,
        location.images = req.body.images;
        return location.save(function (err) {
            if (!err) {
                log.info("Location updated");
                return res.send({ status: 'OK', location:location });
            } else {
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
                log.error('Internal error(%d): %s',res.statusCode,err.message);
            }
        });
    });
});

app.delete('/api/locations/:id', function (req, res){
    return LocationModel.findById(req.params.id, function (err, location) {
        if(!location) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return location.remove(function (err) {
            if (!err) {
                log.info("Location removed");
                return res.send({ status: 'OK' });
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }
        });
    });
});
}