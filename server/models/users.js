'use strict';
const crypto = require('crypto');
const mongoose    = require('../db/mongoose');

var Schema = mongoose.Schema;

// Schemas

var Avatar = new Schema({
    name: {
        type: String,
        enum: ['thumbnail', 'detail'],
        required: true
    },
    url: { type: String, required: true }
});

var UserInfo = new Schema({
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

const UserInfoModel = mongoose.model('UserInfo', UserInfo);

module.exports.UserInfoModel = UserInfoModel;