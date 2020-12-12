//Packages koppelen en beschikbaar stellen via app
require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const app = express();

//DB connection and error handling
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'))

console.log('Starting: REST API')




//MIDDLEWARE: checkt of het json is of een form (express ipv bodyParser deprication)
// const bodyParser = require('body-parser');
app.use(express.json());
app.use(express.urlencoded({ extended : true }));



// voeg entry toe voor url / 
app.get('/', function(req, res) {
    console.log("End point /")
    res.header("Content-Type", "application/json")
    res.send("{ \"message\": \"Welcome to donation API!\" }")
})


//ROUTES
let donationsRouter = require('./routes/donationsRouter')();
app.use('/donations', donationsRouter);



// Start web applicatie
app.listen(8000, () => console.log('Server Started'))
   