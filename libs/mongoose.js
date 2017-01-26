'use strict';
const crypto = require('crypto');
const mongoose    = require('./connectMongoose');
const log         = require('./log')(module);

var db = mongoose.connection;

db.on('error', function (err) {
    log.error('Connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

const Schema = mongoose.Schema;

// Schemas

let Images = new Schema({
    kind: {
        type: String,
        enum: ['thumbnail', 'detail'],
        required: true
    },
    url: { type: String, required: true }
});

let Location = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    adress: { type: String, required: true },
    lat: { type: String, required: true },
    lng: { type: String, required: true },
    description: { type: String, required: true },
    images: [Images],
    modified: { type: Date, default: Date.now }
});

// validation
Location.path('title').validate(function (v) {
    return v.length > 5 && v.length < 70;
});

let Avatar = new Schema({
    name: {
        type: String,
        enum: ['thumbnail', 'detail'],
        required: true
    },
    url: { type: String, required: true }
});

let UserInfo = new Schema({
    username:{type:String,unique:true,required: true},
    avatar:[Avatar],
    phone:{type:String,required:true},
    email:{type:String,unique:true,required:true},
    is_admin:{type:String,required:true},
    hashedPassword:{type:String,required:true},
    salt:{type:String,required:true},
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


const LocationModel = mongoose.model('Location', Location);
const UserInfoModel = mongoose.model('UserInfo', UserInfo);

module.exports.LocationModel = LocationModel;
module.exports.UserInfoModel = UserInfoModel;