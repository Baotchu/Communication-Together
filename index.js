var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var bodyParser = require("body-parser");


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

// Coding to sign up data to store Database
app.get('/user', function(request, response) {
  response.render('pages/user');
});

app.post('/user', function(req, res) {
  //Code insert to database

  req.body.firstname = req.body.firstname.replace(/'/g,`''`);
  req.body.lastname = req.body.lastname.replace(/'/g,`''`);
  req.body.email = req.body.email.replace(/'/g,`''`);

  let insert_query = `insert into contact (fname,lname,email,phone,password) 
values ('${req.body.firstname}','${req.body.lastname}','${req.body.email}',
'${req.body.phonenumber}','${req.body.password}');`;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query(insert_query, function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.render('pages/user'); }
    });
  });
  
});

////Coding to search data from Database
app.get('/user_search', function(request, response) {
  let empty_contact = {fname:'', lname:'', phone:''};
  response.render('pages/user_search', {output:empty_contact});
});

app.post('/user_search', function(req, res) {
  //Code select to database

  
  //req.body.email = req.body.email.replace(/'/g,`''`);

  let select_query = `SELECT * FROM contact WHERE email='${req.body.email}';`;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query(select_query, function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       {  res.render('pages/user_search',{output:result.rows});}
    });
  });
});
////
// Coding to sign up data to store Database
app.get('/commun', function(request, response) {
  response.render('pages/commun');
});
// Send SMS 
app.post('/commun/sendmess', function(req, res) {
  //get phone number to twilio
// Twilio Credentials 
var accountSid = 'AC611b523b538e685c24a3e1857233d3b9'; 
var authToken = 'b3b1a62c56bc66710fd1d4fec0eb07e6'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
 
client.messages.create({ 
    to: req.body.phonenumber, 
    from: "+12408028532", 
    body: req.body.message, 
}, function(err, message) { 
    console.log(message.sid); 
});
  
  
  let insert_query = `insert into messg_log (phone,content) 
values ('${req.body.phonenumber}','${req.body.message}');`;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query(insert_query, function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
    });
  });
});


  


//Call outbound phone
// Download the Node helper library from twilio.com/docs/node/install
// These vars are your accountSid and authToken from twilio.com/user/account





// Send email by Nodemailer
app.post('/commun/sendemail', function(req, res) {
var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://chuthaibao1980%40gmail.com:20091980Hbm@smtp.gmail.com');

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'chuthaibao1980@gmail.com', // sender address
   // to: 'github@gmail,baz@blurdybloop.com', // list of receivers
	  to: req.body.email,// list of receivers
    subject: 'Test App NodeJs✔', // Subject line
    text: req.body.emailbox, // plaintext body
   // html: '<b>Sending email by Application. Hello world ?</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});
});

//Create chatting with socket.io

////
app.get('/cool', function(request, response){
  response.send(cool());
})

var pg = require('pg');

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});

app.get('/times', function(request, response) {
  var result = ''
  var times = process.env.TIMES || 5
  for (i=0; i < times; i++)
    result += i + ' ';
response.send(result);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
