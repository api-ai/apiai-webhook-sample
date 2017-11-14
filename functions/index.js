// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const functions = require('firebase-functions');

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  // Log the request header and body coming from API.AI to help debug issues.
  // See https://api.ai/docs/fulfillment#request for more.
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));

  // An action is a string used to identify what tasks needs to be done
  // in fulfillment usally based on the corresponding intent.
  // See https://api.ai/docs/actions-and-parameters for more.
  let action = request.body.result.action;

  // Parameters are any entites that API.AI has extracted from the request.
  // See https://api.ai/docs/actions-and-parameters for more.
  const parameters = request.body.result.parameters;

  // Contexts are objects used to track and store conversation state and are identified by strings.
  // See https://api.ai/docs/contexts for more.
  const contexts = request.body.result.contexts;

  // Initialize JSON we will use to respond to API.AI.
  let responseJson = {};

  // Create a handler for each action defined in API.AI
  // and a default action handler for unknown actions
  const actionHandlers = {
    'input.welcome': () => {
      // The default welcome intent has been matched, Welcome the user.
      // Define the response users will hear
      responseJson.speech = 'Hello, welcome to my API.AI agent';
      // Define the response users will see
      responseJson.displayText = 'Hello! Welcome to my API.AI agent :-)';
      // Send the response to API.AI
      response.json(responseJson);
    },
    'input.unknown': () => {
      // The default fallback intent has been matched, try to recover.
      // Define the response users will hear
      responseJson.speech = 'I\'m having trouble, can you try that again?';
      // Define the response users will see
      responseJson.displayText = 'I\'m having trouble :-/ can you try that again?';
      // Send the response to API.AI
      response.json(responseJson);
    },
    'default': () => {
      // This is executed if the action hasn't been defined.
      // Add a new case with your action to respond to your users' intent!
      responseJson.speech = 'This message is from API.AI\'s Cloud Functions for Firebase editor!';
      responseJson.displayText = 'This is from API.AI\'s Cloud Functions for Firebase editor!';

      // Optional: add rich messages for Google Assistant, Facebook and Slack defined below.
      // Uncomment next line to enable. See https://api.ai/docs/rich-messages for more.
      //responseJson.data = richResponses;

      // Optional: add outgoing context(s) for conversation branching and flow control.
      // Uncomment next 2 lines to enable. See https://api.ai/docs/contexts for more.
      //let outgoingContexts = [{"name":"weather", "lifespan":2, "parameters":{"city":"Rome"}}];
      //responseJson.contextOut = outgoingContexts;

      // Send the response to API.AI
      response.json(responseJson);
    }
  };

  // If the action is not handled by one of our defined action handlers
  // use the default action handler
  if (!actionHandlers[action]) {
    action = 'default';
  }

  // Map the action name to the correct action handler function and run the function
  actionHandlers[action]();
});

// JSON for Rich responses for Google Assistant, Facebook and Slack
const richResponses = {
  'google': {
    'expectUserResponse': true,
    'isSsml': false,
    'noInputPrompts': [],
    'richResponse': {
      'items': [
        {
          'simpleResponse': {
            'textToSpeech': 'This is a simple speech response for Actions on Google.',
            'displayText': 'This is a simple display text response for Action on Google.'
          }
        },
        {
          'basicCard': {
            'title': 'Title: this is a title',
            'subtitle': 'This is a subtitle',
            'formattedText': 'This is a basic card.  Text in a basic card can include \'quotes\' and most other unicode characters including emoji 📱.  Basi cards also support some markdown formatting like *emphasis* or _italics_, **strong** or __bold__, and ***bold itallic*** or ___strong emphasis___ as well as other things like line  \nbreaks',
            'image': {
              'url': 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
              'accessibilityText': 'Image alternate text'
            },
            'buttons': [
              {
                'title': 'This is a button',
                'openUrlAction': {
                  'url': 'https://assistant.google.com/'
                }
              }
            ]
          }
        }
      ]
    }
  },
  'slack': {
    'text': 'This is a text response for Slack.',
    'attachments': [
      {
        'title': 'Title: this is a title',
        'title_link': 'https://assistant.google.com/',
        'text': 'This is an attachment.  Text in attachments can include \'quotes\' and most other unicode characters including emoji 📱.  Attachments also upport line\nbreaks.',
        'image_url': 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
        'fallback': 'This is a fallback.'
      }
    ]
  },
  'facebook': {
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'generic',
        'elements': [
          {
            'title': 'Title: this is a title',
            'image_url': 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
            'subtitle': 'This is a subtitle',
            'default_action': {
              'type': 'web_url',
              'url': 'https://assistant.google.com/'
            },
            'buttons': [
              {
                'type': 'web_url',
                'url': 'https://assistant.google.com/',
                'title': 'This is a button'
              }
            ]
          }
        ]
      }
    }
  }
};
