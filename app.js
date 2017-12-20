const express = require('express')
const app = express()
const path = require("path")

var cookieParser = require('cookie-parser')
var request = require('request')
var fs = require('fs')
var https = require('https')
var config = require('./lib/config')
var misc = require('./lib/misc')
var apiUrl = config.apiUrl;//put this in a config file and make API dns (api.skinnyfit.com) 
var log = require('./lib/log');

app.use(cookieParser()) 

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/home')(app);

app.listen(config.appPort, function () {

  console.log('');
  console.log('Example app listening on port: ' + config.appPort);
  console.log('');

  log.publish({"logType": "info", "msg": "App start"});

  
  misc.getUrl(apiUrl + '/ping', function (err, res) { 
    if(res && res == 1)
      console.log('Connected to API at ' + apiUrl);
    else 
      console.log('COULD NOT CONNECT to API at ' + apiUrl);
    console.log('');
  });
  

})


