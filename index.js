'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();
restService.use(bodyParser.json());

function processChunk(chunk)
{
    console.log(chunk);
}

restService.post('/hook', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';

                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                }

                if (requestBody.result.action) {
                    speech += 'action: ' + requestBody.result.action;
                }
            }
        }

        var queryMedicine;
        var patientName;

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result.resolvedQuery && requestBody.result.parameters.Medications && requestBody.result.parameters.Patient) {
                queryMedicine = requestBody.result.parameters.Medications;
                patientName = requestBody.result.parameters.Patient;
            }
        }
        var allergyCoding;
        var existingAllergies = [];

        /*var opts = {
            url: 'https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/AllergyIntolerance?patient=4342012',
            method: 'GET',
            JSON: true,
            headers: {
                'Accept': 'application/json'
            }
        }*/

        console.log('result: ', speech);

        /*var http = new XMLHttpRequest();
        var url = "https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/AllergyIntolerance?patient=4342012";
        http.open("GET", url, false);

        http.setRequestHeader("Accept", "application/json");
        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                console.log(http.responseText);
            }
        }*/

        /*get.concat(opts, function(err, res, data){
            if (err) throw err;
            var jsonBS = JSON.parse(data);
            var allEntries = jsonBS.entry;
            allEntries.forEach(function(value){
                allergyCoding = value.resource.substance.coding;
                if(allergyCoding && allergyCoding[0].code != 428607008)
                {
                    if(!existingAllergies.includes(value.resource.substance.text))
                        existingAllergies.push(value.resource.substance.text);
                }
            })
            console.log(existingAllergies);
            console.log(queryMedicine);
            if(existingAllergies.includes(queryMedicine))
            {
                speech = patientName + " seems to allergic to " + queryMedicine;
            }
            else
            {
                speech = "That should be good";
            }
        })*/
        var showText = "Based on my data, "+patientName+" should be good with "+queryMedicine;

        return res.json({
            speech: speech,
            displayText: showText,
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

restService.listen(process.env.PORT || 5000, function () {
    console.log("Server listening");
});