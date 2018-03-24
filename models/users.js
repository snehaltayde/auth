const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.connect('mongodb://localhost/sportsblog')
.then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));



//User Schema
const userSchema = mongoose.Schema({
name: {
  type: String
},
username: {
  type: String
},
email: {
  type: String
},
profileimage: {
  type: String
},
password: {
  type: String
},

})

const User = module.exports = mongoose.model('User', userSchema);
//Register USer and Encrypt Password
module.exports.registerUser = function(newUser, callback){
  bcrypt.genSalt(10, (err,salt)=>{
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) {
        console.log(err);
      }
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

//Get Userby userName
module.exports.getuserByUsername = function(username, callback){
  const query = {username: username};
  User.findOne(query,callback);
}
//Get User by id
module.exports.getUserById = function(id, callback){
User.findById(id,callback);
}

//compare Pass

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}
