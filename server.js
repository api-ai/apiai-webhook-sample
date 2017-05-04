/******************
 * SETUP
 *
 * Code for the setup of the Katrien Server
 * Handles custom actions for a Google Home bot, through webhooks to API.ai
 ******************/
//test

// Enable strict mode
"use strict";

// Import Express for routing, etc.
const express = require('express');
// Import filesystem 
const fs = require("fs");
// Import Path
const path = require('path');
// Import BodyParser for parsing data
const bodyParser = require('body-parser');
// Import Request for HTTP requests
const request = require('request');

const app = express();

// Import HTTP server
const http = require('http').Server(app);

// Import socket.io
const io = require('socket.io')(http);


app.use(bodyParser.json());

app.post('/hook', function (req, res) {

    console.log('Request from API.ai received');

    try {   
        var speech = 'empty speech';

        if (req.body && req.body.result) {
            var body = req.body;
            speech = '';

            if (body.result.fulfillment) {
                speech += body.result.fulfillment.speech;
                speech += ' ';
            }

            if (body.result.action) {
                speech += 'action: ' + body.result.action;
            }
            
        }

        console.log('result: ', speech);

        return res.json({
            speech: speech,
            displayText: speech,
            source: 'apiai-webhook-sample'
        });
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

// Defining a route handler / that gets called when we hit our website home.
app.get('/', function(req, res){
    res.sendFile(__dirname + '/frontend/index.html');
});

// Listen on the connection event for incoming sockets, and log it to the console.
io.on('connection', function(socket){
  console.log('a user connected');
  setTimeout(function(){
    //Sending an object when emmiting an event
    socket.emit('testerEvent', res.json);
    }, 4000);
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});



http.listen((process.env.PORT || 5000), function () {
    console.log("Server started");
});

