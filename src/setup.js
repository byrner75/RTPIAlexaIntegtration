var UserProfileDao = require('./UserProfileDao')

console.log("Creating UserProfileDao instance")

var userProfile = new UserProfileDao();

userProfile.createTable();