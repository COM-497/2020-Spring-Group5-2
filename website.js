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

app.use('*',function(req, res){
  res.send('Error 404: Not Found!');
});


app.listen(3000,function(){
  console.log("Server running at Port 3000");
});