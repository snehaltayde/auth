var express = require("express");
var router = express();
var User = require('../models/users');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


router.get('/', ensureAuthenticated,(req,res,next) => {
  res.render('index',{
    title: 'Index'
  });
});

router.get('/register', (req,res,next) => {
  res.render('register',{
    title: 'Register'
  });
});

//Process login
router.get('/login',(req,res,next)=> {
  res.render('login',{
    title: "Login"
  });
});

//Logout
router.get('/logout', (req,res,next)=> {
req.logout();
req.flash('success', 'You are Logged Out');
res.redirect('/login');
});

//Process Register
router.post('/register', (req,res,next) => {
const name = req.body.name;
const email = req.body.email;
const username = req.body.username;
const password = req.body.password;
const password2 = req.body.password2;

req.checkBody('name', 'Name field is required').notEmpty();
req.checkBody('email', 'Email is incorrect').isEmail();
req.checkBody('email', 'email field is required').notEmpty();
req.checkBody('username', 'username field is required').notEmpty();
req.checkBody('password', 'password field is required').notEmpty();
req.checkBody('password2', 'password doesnt match').equals(req.body.password);

let errors = req.validationErrors();

  if(errors){
    res.render('register', {
    title: "Register",
    errors: errors
  });
  }
  else{
    const user = new User({
      name: name,
      username: username,
      email: email,
      password: password
    });

  User.registerUser(user, (err, user)=> {
    if(err){
      console.log(err);
    }
    req.flash('success', 'Registration Successfull, You Can Login');
    res.redirect('/login');
  })
  }
});

//Passport Local Strategy
passport.use(new LocalStrategy((username,password,done)=>{
  User.getuserByUsername(username, (err,user)=>{
    if(err){
      throw err;
    }
    if(!user){
      return done(null, false, {message: 'No user Found'});
    }

  User.comparePassword(password, user.password, (err, isMatch)=> {
  if(err){
    throw err;
  }
  if(isMatch){
    return done(null, user);
  }
  else{
    return done(null, false, {message: 'Wrong Password'})
  }
});
});
}));

//Stralize Destralize Passport users
passport.serializeUser((user, done) => {
  done(null, user.id);
  console.log(user);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id,(err, user) => {
    console.log('hello2');
    done(err, user);
  });
});


//login post process
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash: true
  })(req, res, next);
});


//function to ensure authenticated
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('error_msg', 'You are not authorized to view that page');
    res.redirect('/login');
  }
}
module.exports = router;
