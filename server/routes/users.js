'use strict';
const crypto = require('crypto');
const co = require('co');
const UserInfoModel    = require('../db/mongoose').UserInfoModel;
module.exports = function(app){

app.get('/api/users', co.wrap(function * (req, res) {
	try {
		const user = yield UserInfoModel.findById(req.params.id);
            if (!user) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }
            return res.send({ status: 'OK', user:user });
        } catch (e) {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({error: 'Server error'});
        }
	}));
app.post('/api/users',function(req,res,next){
	var username = req.query.username;
	var password = req.query.password;
	UserInfoModel.findOne({username:username},function(err,user){
		if(err) return next(err);
		if(user){
			if(user.checkPassword(password)){
				//req.session.user = user._id;
				res.statusCode = 200;
				return res.send({ success: 'Correct Password' });
				
			}else{
				res.statusCode = 403;
				return res.send({ error: 'Incorrect Password' });
			}			
		}else{
			res.statusCode = 404;
            return res.send({ error: 'User not found' });
		}
	})
});

app.get('/api/user/:id',function(req,res,next){
	UserInfoModel.findById(req.params.id,function(err,user){
		if(err) return next(err);
		if(!user){
			res.statusCode = 404;
            return res.send({ error: 'User not found' });
		}
		res.json(user);
	})
});

app.post('/api/user/add',function(req,res,next){
	
	var user = new UserInfoModel({
        username: req.query.username,
        password: req.query.password,
        phone: req.query.phone,
        avatar: req.query.avatar,
		email: req.query.email,
		is_admin: req.query.is_admin
    });

	user.save(function(err,user){
		if(err) return next(err);
		return res.send({ status: '200', success:'Saved successfull' });
	})
});
app.post('/api/user/delete/:id',function(req,res,next){
	UserInfoModel.remove({_id:req.params.id},function(err,user){
		if(err) return next(err);
		return res.send({ status: '200', success:'Deleted successfully' });
	})
});
}