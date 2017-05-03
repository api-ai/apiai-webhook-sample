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


app.listen((process.env.PORT || 5000), function () {
    console.log("Server started for realz");
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


