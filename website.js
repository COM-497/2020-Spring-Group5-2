var express = require('express');
var app = express();
var router = express.Router();

var path = __dirname + '/views/';
  
app.use('/',router);
app.use(express.static('views'));
  
router.get('/',function(req, res){
  res.sendFile(path + 'index.html');
});

router.get('/about',function(req, res){
  res.sendFile(path + 'about.html');
});

router.get('/events',function(req, res){
    res.sendFile(path + 'events.html');
});

router.get('/myprofile',function(req, res){
  res.sendFile(path + 'myprofile.html');
});

router.get('/support',function(req, res){
  res.sendFile(path + 'support.html');
});

router.get('/login',function(req, res){
  res.sendFile(path + 'login.html');
});

router.get('/orgsignup',function(req, res){
  res.sendFile(path + 'orgsignup.html');
});

router.get('/usersignup',function(req, res){
  res.sendFile(path + 'usersignup.html');
});

router.get('/userororg',function(req, res){
  res.sendFile(path + 'userororg.html');
});

app.use('*',function(req, res){
  res.send('Error 404: Not Found!');
});


app.listen(3000,function(){
  console.log("Server running at Port 3000");
});