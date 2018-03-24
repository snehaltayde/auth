const fs = require('fs');
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
const multer = require('multer');
const crypto =require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
var User = require('./models/users');
// const Userdb = mongoose.connect('mongodb://localhost/sportsblog');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg' )
  }
});
const upload = multer({storage: storage});

// // Init gfs
// let gfs;

// // Create storage engine
// const storage = new GridFsStorage({
//   url: Userdb,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads'
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });



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
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


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
  res.locals.user = req.user || null;
  res.locals.userfilename = req.profileimage || null;
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

app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files);
  });
});

//Listen
app.listen(3000, () => {
  console.log('Server Conected');
})
