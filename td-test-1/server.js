var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));

// Get all list
app.get('/home', function (req, res) {
   res.sendFile( __dirname + "/" + "home.html" );
})

app.get('/person', urlencodedParser, function (req, res) {
   // Prepare output in JSON format
   fs.readFile( __dirname + "/public/" + "person.json", 'utf8', function (err, data) {
      console.log( data );
      res.end();
   });
})

// Create new person
app.get('/form', function (req, res) {
   res.sendFile( __dirname + "/" + "form.html" );
})

app.use(express.json())

app.post('/person', urlencodedParser, function (req, res) {
   // Prepare output in JSON format
   response = {
      id: req.body.id,
      name: req.body.name
   };
   console.log(response);
   res.end();
   
   fs.readFile( __dirname + "/public/" + "person.json", 'utf8', function readFileCallback(err, data){
      if (err){
         console.log(err);
      } else {
      var jsonData = JSON.parse(data);
      jsonData.persons[jsonData.persons.length] = response; //add some data
      json = JSON.stringify(jsonData); //convert it back to json
      fs.writeFile( __dirname + "/public/" + "person.json", json, function(err) {  if(err) throw err; }); // write it back
   }});
})

// Show detail person
app.get('/person/:id', function (req, res) {
   fs.readFile( __dirname + "/public/" + "person.json", 'utf8', function (err, data) {
      var persons = JSON.parse( data );
      for(i=0;i<persons.persons.length;i++) {
         if (persons.persons[i].id === req.params.id) {
            console.log( persons.persons[i] );
         }
      }
      res.end();
   });
})

// Start the server
const port = 8081;
const server = app.listen(port, (error) => {
   if (error) return console.log(`Error: ${error}`);
   console.log(`Server listening on port ${server.address().port}`);
});