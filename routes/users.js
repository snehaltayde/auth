var express = require("express");
var router = express();

router.get('/user',(req,res,next)=> {
  res.render('users',{
    title: "Title"
  });
});

module.exports = router;
