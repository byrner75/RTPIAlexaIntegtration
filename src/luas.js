/**
 * App ID for the skill
 */
var APP_ID = "amzn1.echo-sdk-ams.app.35dec6d6-dffe-4e2a-95bb-bc7017af84da";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var RTPIClient = require('./RTPIClient.js')

var EchoLuas = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
EchoLuas.prototype = Object.create(AlexaSkill.prototype);
EchoLuas.prototype.constructor = EchoLuas;

EchoLuas.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("EchoLuas onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

EchoLuas.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("EchoLuas onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
EchoLuas.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("EchoLuas onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

EchoLuas.prototype.intentHandlers = {
    "GetNextTramIntent": function (intent, session, response) {
        handleNextTramRequest(intent, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask Echo Luas for the time of the next LUAS", "What can I help you with?");
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

/**
 * Gets a random new fact from the list and returns to the user.
 */
function handleNextTramRequest(intent, response) {
    console.log("> handleNextTramRequest");
    console.log(intent);
    var client = new RTPIClient();
    client.realtimeInformation("LUAS10", intent.slots.Route.value, "LUAS", 1, 
    function (json) {
        // Create speech output
        console.log(json);
        var speechOutput;
        if (json.results.length) {
            speechOutput = "The next tram is in " + json.results[0].duetime + " minutes";
        }
        else {
            speechOutput = "Hhhhmm looks like your walking home, there doesnt appear to be any more trams";
        }
        
        response.tellWithCard(speechOutput, "EchoTram", speechOutput);    
    },
    function (err) {
        var speechOutput = "I encountered a problem retrieving that information";

        response.tellWithCard(speechOutput, "EchoBus", speechOutput);
    });
    console.log("< handleNextTramRequest");
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceGeek skill.
    var echoLuas = new EchoLuas();
    echoLuas.execute(event, context);
};

