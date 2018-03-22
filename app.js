const express = require('express');
const path = require('path');
const bodyparser = require('body-parser')
const ejs = require('ejs');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const morgan = require('morgan');


//APp INit
const app = express();

//BodyParser Middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : true}));


//Routes Middleware
const index = require('./routes/index');
const users = require('./routes/users');


//morgan Middleware
app.use(morgan('dev'))



//passport.use(new LocalStrategy(User.authenticate()));

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')


//Static Folder Middleware
app.use(express.static(path.join(__dirname, 'public')));

//Express Flash messages
app.use(session({
    saveUninitialized: false,
    resave: true,
    secret: 'secret'
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Express validator Middleware
// Express messages
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
//End


// Express validator
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
      const namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


//Use Routes
app.use('/', index);
app.use('/users', users);

//Listen
app.listen(3000, () => {
  console.log('Server Conected');
})
