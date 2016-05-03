/**
 * App ID for the skill
 */
var APP_ID = "amzn1.echo-sdk-ams.app.dec3cf8c-11aa-4035-ae6c-dcaaa355e547";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var RTPIClient = require('./RTPIClient');
var moment = require('moment');
var winston = require('winston');

var EchoBus = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
EchoBus.prototype = Object.create(AlexaSkill.prototype);
EchoBus.prototype.constructor = EchoBus;

EchoBus.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    winston.log("debug", "EchoBus onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

EchoBus.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    winston.log("debug", "EchoBus onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
EchoBus.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    winston.log("debug", "EchoBus onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

EchoBus.prototype.intentHandlers = {
    "GetNextBusIntent": function (intent, session, response) {
        handleNextBusRequest(intent, response);
    },
    
    "GetNextBusTimeIntent": function (intent, session, response) {
        handleNextBusTimeRequest(intent, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask Echo Bus for the time of the next bus", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

function handleNextBusRequest(intent, response) {
    winston.log("debug", "> handleNextBusRequest");
    winston.log("debug", intent);
    var client = new RTPIClient();
    client.realtimeInformation(4182, intent.slots.Route.value, "bac", 1, 
    function (json) {
        // Create speech output
        winston.log("debug", json);
        var speechOutput;
        if (json.results.length) {
            speechOutput = "The next bus is in " + json.results[0].duetime + " minutes";
        }
        else {
            speechOutput = "Hhhhmm looks like your walking home, there doesnt appear to be any more buses";
        }
        
        response.tellWithCard(speechOutput, "EchoBus", speechOutput);    
    },
    function (err) {
        var speechOutput = "I encountered a problem retrieving that information";

        response.tellWithCard(speechOutput, "EchoBus", speechOutput);
    });
    winston.log("debug", "< handleNextBusRequest");
}

function handleNextBusTimeRequest(intent, response) {
    winston.log("debug", "> handleNextBusTimeRequest");
    winston.log("debug", intent);
    var client = new RTPIClient();
    client.realtimeInformation(4182, intent.slots.Route.value, "bac", 1, 
    function (json) {
        // Create speech output
        winston.log("debug", json);
        var speechOutput = {
            "type": "SSML"
        };
        if (json.results.length) {
            var moment = require('moment');
            var d = moment(json.results[0].arrivaldatetime, 'DD/MM/YYYY HH:mm:ss');
//            speechOutput.speech = "<speak>The next bus is at " + (d.minutes() ? d.minutes() + " minutes past " : "") + d.format("hh") + " " + d.format("a") + "</speak>";
            speechOutput.speech = "<speak>The next bus is at <say-as interpret-as=\"time\">" + d.format("hh:mm a") + "</say-as></speak>"
        }
        else {
            speechOutput.speech = "<speak>Hhhhmm looks like your walking home, there doesnt appear to be any more buses</speak>";
        }
        winston.log("debug", speechOutput);
        
        response.tell(speechOutput);
    },
    function (err) {
        var speechOutput = "I encountered a problem retrieving that information";
        
        response.tellWithCard(speechOutput, "EchoBus", speechOutput);
    });
    winston.log("debug", "< handleNextBusTimeRequest");
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceGeek skill.
    var echoBus = new EchoBus();
    echoBus.execute(event, context);
};

