var Alexa = require('alexa-sdk')
var AWS = require("aws-sdk");

var moment = require('moment');
var winston = require('winston');
var RTPIClient = require('./RTPIClient');

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

/**
 * App ID for the skill
 */
var APP_ID = "amzn1.echo-sdk-ams.app.97e36e14-c5b0-4bcd-aec4-a5ce15051755";

exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.dynamoDBTableName = "BusState";
    alexa.registerHandlers(intentHandlers, eventHandlers);
    alexa.execute();  
}

var intentHandlers = {
    "GetNextBusIntent": function () {
        console.log("GetNextBusIntent")
        handleNextBusRequest(this.event.request.intent, this);
    },
    
    "GetNextBusTimeIntent": function () {
        handleNextBusTimeRequest(this.event.request.intent, this);
    },

    "SetFavouriteRouteIntent": function() {
        this.emit(':tell', "Thank you");            
    },

    "AMAZON.HelpIntent": function () {
        this.emit(':ask', "You can ask Echo Bus for the time of the next bus", "What can I help you with?");
    },

    "AMAZON.StopIntent": function () {
        var speechOutput = "Goodbye";
        this.emit(':tell', speechOutput);
    },

    "AMAZON.CancelIntent": function () {
        var speechOutput = "Goodbye";
        this.emit(':tell', speechOutput);
    }
}

var eventHandlers = {
    "Launch": function() {
        winston.log("debug", "EchoBus onLaunch requestId: " + this.event.request.requestId + ", sessionId: " + this.event.session.sessionId);       
    },

    "SessionStartedRequest": function() {
        winston.log("debug", "EchoBus onSessionStarted requestId: " + this.event.request.requestId
            + ", sessionId: " + this.event.session.sessionId);        
    },

    "SessionEndedRequest": function() {
        winston.log("debug", "EchoBus onSessionEnded requestId: " + this.event.request.requestId
            + ", sessionId: " + this.event.session.sessionId);        
    }
}


function handleNextBusRequest(intent, alexa) {
    winston.log("debug", "> handleNextBusRequest");
    winston.log("debug", intent);
    if(alexa.attributes["StopNumber"]) {
        var client = new RTPIClient();
        //4182
        client.realtimeInformation(alexa.attributes["StopNumber"], intent.slots.Route.value, "bac", 1, 
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
            
            alexa.emit(':tell', speechOutput);
        },
        function (err) {
            var speechOutput = "I encountered a problem retrieving that information";

            alexa.emit(":tell", speechOutput);
        });
    }
    else {
        alexa.attributes["StopNumberRequired"] = true; 
        alexa.attributes["Route"] = intent.slots.Route.value; 
        alexa.emit(":ask", "What is your stop number?")
    }
    winston.log("debug", "< handleNextBusRequest");
}

function handleNextBusTimeRequest(intent) {
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
        
        this.emit(':tell', speechOUtput);
    },
    function (err) {
        var speechOutput = "I encountered a problem retrieving that information";
        
        this.emit(':tell', speechOutput);
    });
    winston.log("debug", "< handleNextBusTimeRequest");
}

