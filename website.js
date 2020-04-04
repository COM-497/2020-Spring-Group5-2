var express = require('express');
var app = express();
var router = express.Router();
var passport = require('passport')
LocalStrategy = require('passport-local').Strategy;
const {MongoClient} = require('mongodb');
const {parse} = require('querystring');

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

app.post('/login',
  passport.authenticate('local', { successRedirect: '/myprofile',
                                   failureRedirect: '/' })
);

router.get('/orgsignup',function(req, res){
  res.sendFile(path + 'orgsignup.html');
});

router.post('/orgsignup', (req, res) => {   
  let body = '';     
  req.on('data', chunk => {         
    body += chunk.toString(); // convert Buffer to string
});

req.on('end', () => {
  var value = parse(body);
  var a = value['password'];
  var b = value['confirm_password'];
    if(a == b){
      console.log('Passwords match');
      var queryString = require('querystring');
      var org = queryString.parse('organization='+value['organization']+'&type='+value['type']+'&description='+value['description']+'&email='+value['email']+'&password='+value['password']);
      insertOrganization(org);
      console.log(org);
      res.redirect('/myprofile') 
    }else {
      res.send('Passwords do not match');
    }
  
});  
});

router.get('/eventForm',function(req, res){
  res.sendFile(path + 'eventForm.html');
});

router.post('/eventForm', (req, res) => {   
  let body = '';     
  req.on('data', chunk => {         
    body += chunk.toString(); // convert Buffer to string
});

req.on('end', () => {
  var value = parse(body);
      var queryString = require('querystring');
      var event = queryString.parse('&organization='+value['organization']+'event='+value['event']+'dateOfEvent='+value['date']+'&descriptionEvent='+value['descriptionEvent']+'&typeOfEvent='+value['type']+'&descriptionOfOrg='+value['descriptionOrg']+'&contactToDonors='+value['contact']+'&goal='+value['goal']+'&whereMoneyGoes='+value['whereMoneyGoes']);
      insertEvent(event);
      console.log(event);
      res.redirect('/events') 
});  
});

router.get('/usersignup',function(req, res){
  res.sendFile(path + 'usersignup.html');
});

router.post('/usersignup', (req, res) => {   
  let body = '';     
  req.on('data', chunk => {         
    body += chunk.toString(); // convert Buffer to string
});

req.on('end', () => {
  var value = parse(body);
  var a = value['password'];
  var b = value['confirm_password'];
    if(a == b){
      console.log('Passwords match');
      var queryString = require('querystring');
      var user = queryString.parse('firstname='+value['firstName']+'&lastname='+value['lastName']+'&email='+value['email']+'&password='+value['password']);
      insertUser(user);
      console.log(user);
      res.redirect('/myprofile') 
    }else {
      res.send('Passwords do not match');
    }
  
});  
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

async function insertOrganization(newOrganization) {
  const uri = "mongodb+srv://brianay:charinforg@mycluster-iw4qo.mongodb.net/test?retryWrites=true&w=majority";   
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });       

  try {     
    await client.connect();   

    const result = await client.db("charinforg").collection("organization").insertOne(newOrganization);
  console.log(`${result.insertedCount} new organization created with the following id: `);
  console.log(result.insertedId);
    }
  catch (e) {
    console.error(e);   
} finally {     
    await client.close();   
  }
}  

async function insertUser(newUser) {
  const uri = "mongodb+srv://brianay:charinforg@mycluster-iw4qo.mongodb.net/test?retryWrites=true&w=majority";   
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });       

  try {     
    await client.connect();   

    const result = await client.db("charinforg").collection("user").insertOne(newUser);
  console.log(`${result.insertedCount} new user created with the following id: `);
  console.log(result.insertedId);
    }
  catch (e) {
    console.error(e);   
} finally {     
    await client.close();   
  }
}  

async function insertEvent(newEvent) {
  const uri = "mongodb+srv://brianay:charinforg@mycluster-iw4qo.mongodb.net/test?retryWrites=true&w=majority";   
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });       

  try {     
    await client.connect();   

    const result = await client.db("charinforg").collection("event").insertOne(newEvent);
  console.log(`${result.insertedCount} new event created with the following id: `);
  console.log(result.insertedId);
    }
  catch (e) {
    console.error(e);   
} finally {     
    await client.close();   
  }
}  

/*async function main() {   
  const uri = "mongodb+srv://brianay:charinforg@mycluster-iw4qo.mongodb.net/test?retryWrites=true&w=majority";   
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });       

  try {     
    await client.connect();   
    
    await createUser(
      client,
      {
        firstName: "user1first",
        lastName: "user1last",
        email: "test@email.com",
        password: "test"
      }
    );

    await createMultipleOrganizations(client, [
     
     {
      organization: "YMCA",
      type: "International non-governmental",
      description: "Committed to strengthening community by connecting all people to their potential, purpose and each other. Working locally, we focus on empowering young people, improving health and well-being and inspiring action in and across communities.",
      email: "ymca@email.com",
      password: "test"
     }, 
     {
      organization: "Girls on the Run Greater Tampa Bay",
      type: "Non-profit",
      description: "A life-changing program for 8- to 13-year-old girls that promotes girl empowerment by teaching life skills through lessons and running.",
      email: "gotr@email.com",
      password: "test"
     }
    ]
    );


  } 
  catch (e) {
    console.error(e);   
  } finally {     
    await client.close();   
    }   
}
 main().catch(console.error);  
          
 async function createMultipleOrganizations(client, newOrganizations){
  const result = await client.db("charinforg").collection("organization").insertMany(newOrganizations);
  console.log(`${result.insertedCount} new organization(s) created with the following ids: `);
  console.log(result.insertedIds);
 }

 async function createUser(client, newUser){
  const result = await client.db("charinforg").collection("user").insertOne(newUser);
  console.log(`New user created with the following id: ${result.insertedId}`);
}
*/

passport.use(new LocalStrategy({
  usernameField: 'email'
},
  function(username, password, done) {
    User.findOne({ email: email }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));