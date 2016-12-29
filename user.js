const UserInfoModel = require('./libs/users').UserInfoModel;

var user = new UserInfoModel({
    username: 'admin',
    avatar: {name: 'test', url: 'C:\\image.jpg'},
    phone: '+38099 999 99 99',
    email: 'test@test.com',
    is_admin: '1',
    password: 'admin'
});

user.save(function (err, user, affected) {
    if (err) throw err;
})