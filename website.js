var express = require('express');
var app = express();
var router = express.Router();
const {MongoClient} = require('mongodb');

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

router.post('/orgsignup', (req, res) => {   
  let body = '';     
  req.on('data', chunk => {         
    body += chunk.toString(); // convert Buffer to string
});
req.on('end', () => {
    console.log(body);
    res.sendFile(path + "myprofile.html");
});  
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

async function main() {   
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
      orgName: "YMCA",
      type: "International non-governmental",
      description: "Committed to strengthening community by connecting all people to their potential, purpose and each other. Working locally, we focus on empowering young people, improving health and well-being and inspiring action in and across communities.",
      email: "ymca@email.com",
      password: "test"
     }, 
     {
      orgName: "Girls on the Run Greater Tampa Bay",
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