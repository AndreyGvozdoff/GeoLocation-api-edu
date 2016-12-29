"use strict";
const crypto = require('crypto');
const mongoose    = require('./connectMongoose');
const log         = require('./log')(module);

const db = mongoose.connection;

db.on('error', function (err) {
	log.error('connection error:', err.message);
});
db.once('open', function callback () {
	log.info("Connected to DB!");
});

let Schema = mongoose.Schema;

var Avatar = new Schema({
	name: {
		type: String,
		enum: ['thumbnail', 'detail'],
		required: true
	},
	url: { type: String, required: true }
});
//Container Shipping
var contTransport = new Schema({
	country:{type:String,required: true},
	city:{type:String,required: true},
	lat:{type:String,required: true},
	lng:{type:String,required: true},
	ready:{type:Date,required: true},
	line:{type:String,required: true},
	conteiner:{type:String,required: true},
	amount:{type:String,required: true},
	note:{type:String,required: true},
	statys:{type:String,required: true},
	state:{type:String,required: true},
	active:{type:String,required: true},
	time:{type:Date,default: Date.now}
});

var UserInfo = new Schema({
	username:{type:String,unique:true,required: true},
	avatar:[Avatar],
	phone:{type:String,required:true},
	email:{type:String,unique:true,required:true},
	is_admin:{type:String,required:true},
	hashedPassword:{type:String,required:true},
	salt:{type:String,required:true},
	cont_transport: [contTransport],
	data_added:{type:Date,default:Date.now }
});

UserInfo.methods.encryptPassword = function(password){
	return crypto.createHmac('sha1',this.salt).update(password).digest('hex');
};

UserInfo.virtual('password').set(function(password){
	this._plainPassword = password;
	this.salt = Math.random() + '';
	this.hashedPassword = this.encryptPassword(password);
}).get(function(){ return this._plainPassword; });

UserInfo.methods.checkPassword=function(password){
	return this.encryptPassword(password) === this.hashedPassword;
};
const UserInfoModel = mongoose.model('UserInfo', UserInfo);

module.exports.UserInfoModel = UserInfoModel;