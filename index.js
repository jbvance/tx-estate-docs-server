//Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');


// Set config variables for development
if (app.settings.env === "development"){
  console.log("LOADING DEV ENV CONFIG");
  require('dotenv').config();
}


//DB Setup
mongoose.connect(process.env.DB_CONNECT_STRING);

//App Setup
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({type: '*/*'}));
router(app);


//Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on port: ', port);
