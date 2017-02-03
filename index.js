'use strict';

const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
restService.use(bodyParser.json());

var eventschedule = {
    slamNation:"slamnation_feb03",
    youveGotMail:"yougotmail_feb03",
    spandan:"spandan_feb03",
    yavnika:"yavnika-feb03",
    izraz:"izraz_feb03",
    soloTrioCompetition:"soloandtrio_feb03",
    malhaar:"malhaar_feb03",
    acapella:"acapella",
    harf:"harf",
    mudra:"mudra",
    popCultureQuiz:"popCultureQuiz",
    saaz:"saaz",
    writeMeATale:"writeMeATale",
    storytellingCompetition:"storytellingCompetition",  
    thingsOnlyGetVerse:"ngsOnlyGetVerse",
    nukkad:"nukkad",
    baila:"baila",
    battleOfBands:"battleOfBands",
    sangam:"sangam"    
};


var eventschedule_noimage = {
    sugam:"Sugam is happening on 3-02-2017 from 2 PM - 5 PM in New Common Room",
    kairosPhotoExhibition:"Kairos Photo Exhibition is happening on 3rd, 4th and 5th of February from 9 AM - 6 PM in Exhibition Hall 1",
    spotOn:"Spot On is happening on 3-02-2017 from 2 PM - 3:30 PM in G1",
    musidora:"Musidora is happening on 3-02-2017 from 10 AM - 12 PM in Media Lab",
    umbrellaPainting:"Umbrella Painting is happening on 3-02-2017 from 10 AM - 4 PM in Amphitheatre",
    exhibition:"Hive Exhibition is happening on 3rd, 4th and 5th of February from 7 am to 8 pm, 7 am to 8 pm, 8 am to 6 pm in Amphitheatre top part and Bamboo Area",
    jewellerymakingworkshop:"Jewellery Making Workshop is happening on 3-02-2017 from 9 AM - 4 PM outside Nescafe",
    tapestryandgreenquoteboard:"Tapestry and Green Quote Board is happening on 3rd, 4th and 5th of February from 9 AM - 5 PM outside new Common Room",
    writeMeATale:"Write Me A Tale is happening on 04-02-2017 from 9 am - 12 pm in Upper Seminar Room",
    popCultureQuiz:"Pop Culture Quiz is happening on 04-02-2017 from 1:30-4pm in Room 27 and 28",
    indiaQuiz:"India Quiz is happening on 04-02-2017 from 10am - 1pm in Room 27 and 28",
    harf:"Harf is happening on 04-02-2017 from 9 am - 4 pm in G2 and G3",
    saaz:"Saaz is happening on 04-02-2017 from 9 am- 1 pm in Bamboo Hut",
    amalgam:"Amalgam is happening on 04-02-2017 from 3 pm - 6 pm in Auditorium",
    mudra:"Mudra is happening on 04-02-2017 from 12 pm - 3 pm in Auditorium",
    chalchitraKaManchitra:"Chalchitra ka Manchitra is happening on 04-02-2017 from 10 am - 12 pm in Media Lab",
    musicInterpretationCompetition:"Music Interpretation Competition is happening on 04-02-2017 from 10 am - 2pm in New Common Room",
    potteryWorkshop:"Pottery workshop is happening on 4th and 5th February from 9 am - 4 pm outside Nescafe",
    flamesQuiz:"FLAMES Quiz is happening on 05-02-2017 from 10 am - 3 am in Room 27 and 28",
    jugalGaayan:"Jugal Gaayan is happening on 05-02-2017 from 2 pm - 5 pm in NCR",
    adMakingCompetition:"Ad Making Competition is happening on 05-02-2017 from 10 am - 12 pm in Media Lab",
    stillLifePainting:"Still Life Painting is happening on 05-02-2017 from 9 am - 1 pm in New Common Room",
    treasureHunt:"Treasure hunt is happening on 05-02-2017 from 12 pm- 3 pm outside Nescafe",
    collegeGeneralQuiz :"College General Quiz is happening on 03-02-2017 from 10 am - 3 pm in Room 27 and 28",
    tarkvyuh:"Tarkvyuh is happening on 3rd and 4th of February from 9 am to 5 pm in New Conference Hall and first, second & third floor of the New Building",
    emakimono:"Emakimono Level 1, 2 and Final are happening on 3rd, 4th and 5th of February from 10 am to 2 pm, 11 am to 1 pm, 11 am to 1 pm in G1"       
};

var imageurl = "http://livon.allsocialassets.com/botimages/";

restService.post('/webhook', function (req, res) {

    console.log('hook request');

    try {
        var speech = '';
        var imageselector = '';

        if (req.body) {
            var requestBody = req.body;
            var eventselector=requestBody.result.parameters.Events;            
            console.log('Event Selector: ' + eventselector);
            if (requestBody.result) {
                speech = '';

                if (requestBody.result.action) {
                    if (eventschedule.hasOwnProperty(requestBody.result.parameters.Events)) {             
                        imageselector =  imageurl + eventschedule[eventselector] + ".png";
                    }
                    else {
                        speech = eventschedule_noimage[eventselector];                        
                    }
                }
            }
        }

        console.log('result: ', speech);
    
        if (speech == '') {

            return res.json({
                speech: speech,
                displayText: speech,
                data: {
                    facebook: {
                            attachment: {
                                type: 'image',
                                payload: {
                                    url: imageselector 
                                }
                            }
                    }
                },
                contextOut: [{
                    name: 'schedule-given',
                    lifespan: 5,
                    parameters: {
                        eventidentified: requestBody.result.action
                    },
                }],
                source: 'gsgbot'
            });                

        } else if (typeof speech !== 'undefined') {
            return res.json({
                speech: speech,
                displayText: speech,
                data: {},
                contextOut: [{
                    name: 'schedule-given',
                    lifespan: 5,
                    parameters: {
                        eventidentified: requestBody.result.action
                    },
                }],
                source: 'gsgbot'
            });        
        }

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

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});
