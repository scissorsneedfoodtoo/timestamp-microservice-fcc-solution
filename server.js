'use strict';
require('dotenv').config();
const express = require('express');
const app = express();

const cors = require('cors');
const portNum = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });
    
app.route('/api/timestamp/:date?')
  .get(function (req, res){
    
    let date = null;
    // parse the date string
    if (req.params.date !== undefined) {

      // check if it is a unix timestamp...
      const unixTimestamp = parseInt(req.params.date*1);
      if (isNaN(unixTimestamp)) {
        
        // it's not a unix timestamp string
        date = new Date(req.params.date);
      } else {
        
        // it is a timestamp
        date = new Date(unixTimestamp);
      }
      
    } else {
      
      // the date string parameter is empty. 
      // create a new date based on current time 
      date = new Date(Date.now());
    }
    
    // Initialize the response object, if Date is invalid
    // this one will be returned

    const response = date == "Invalid Date" ? 
      { error: "Invalid Date" } :
      { "unix": date.getTime(),
        "utc": date.toUTCString()
      };
    
    res.json(response);
  });
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

app.listen(portNum, function () {
  console.log(`Listening on port ${portNum}`);
});

module.exports = app; // for testing
