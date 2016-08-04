var nock = require('nock');
var expect = require("chai").expect;
var EchoBus = require('../src/bus');
var winston = require('winston');
var nokeResponse = {
    "errorcode": "0",
    "errormessage": "",
    "numberofresults": "1",
    "stopid": "4182",
    "timestamp": "02/05/2016 08:49:32",
    "results": [
        {
            "arrivaldatetime": "02/05/2016 09:06:03",
            "duetime": "16",
            "departuredatetime": "02/05/2016 09:06:03",
            "departureduetime": "16",
            "scheduledarrivaldatetime": "02/05/2016 09:06:00",
            "scheduleddeparturedatetime": "02/05/2016 09:06:00",
            "destination": "Heuston Station",
            "destinationlocalized": "Stáisiun Heuston",
            "origin": "Southern Cross",
            "originlocalized": "Southern Cross",
            "direction": "Inbound",
            "operator": "bac",
            "additionalinformation": "",
            "lowfloorstatus": "no",
            "route": "145",
            "sourcetimestamp": "02/05/2016 08:07:19",
            "monitored": "true"
        }
    ]
};

var nockResponse2 = {
    "errorcode": "0",
    "errormessage": "",
    "numberofresults": 2,
    "stopid": "4182",
    "timestamp": "02/05/2016 14:01:59",
    "results": 
 [
        {
            "arrivaldatetime": "02/05/2016 14:29:27",
            "duetime": "27",
            "departuredatetime": "02/05/2016 14:29:27",
            "departureduetime": "27",
            "scheduledarrivaldatetime": "02/05/2016 14:29:00",
            "scheduleddeparturedatetime": "02/05/2016 14:29:00",
            "destination": "Heuston Station",
            "destinationlocalized": "Stáisiun Heuston",
            "origin": "Southern Cross",
            "originlocalized": "Southern Cross",
            "direction": "Inbound",
            "operator": "bac",
            "additionalinformation": "",
            "lowfloorstatus": "no",
            "route": "145",
            "sourcetimestamp": "02/05/2016 13:30:44",
            "monitored": "true"
        },
        {
            "arrivaldatetime": "02/05/2016 14:50:40",
            "duetime": "48",
            "departuredatetime": "02/05/2016 14:50:40",
            "departureduetime": "48",
            "scheduledarrivaldatetime": "02/05/2016 14:51:00",
            "scheduleddeparturedatetime": "02/05/2016 14:51:00",
            "destination": "Heuston Station",
            "destinationlocalized": "Stáisiun Heuston",
            "origin": "Southern Cross",
            "originlocalized": "Southern Cross",
            "direction": "Inbound",
            "operator": "bac",
            "additionalinformation": "",
            "lowfloorstatus": "no",
            "route": "145",
            "sourcetimestamp": "02/05/2016 13:52:10",
            "monitored": "true"
        }
    ]
};

function buildEvent(intent, slots) {
    return {
        "session": {
            "application": {
                "applicationId": "amzn1.echo-sdk-ams.app.dec3cf8c-11aa-4035-ae6c-dcaaa355e547"
            }
        },
        "request": {
            "type": "IntentRequest",
            "requestId": "EdwRequestId.b2c58c55-281e-4164-b384-cce12bd14071",
            "timestamp": "2016-05-01T19:05:47Z",
            "intent": {
                "name": intent,
                "slots": slots              
            },
            "locale": "en-US"
        },
        "version": "1.0"
    };
}

describe('GetNextBusIntent tests', function () {
    
    
    beforeEach(function () {
        nocks = nock('https://data.dublinked.ie')
                .get('/cgi-bin/rtpi/realtimebusinformation')
                .query(true)
                .reply(200, nokeResponse);
    });
    
    afterEach(function (done) {
        nock.cleanAll();
        done();
    });
    
    it('should return the number of minutes to the next bus', function (done) {
        
        var context = {
            "succeed": function (response) {
                expect(response.response.outputSpeech.type).to.equal("PlainText");
                expect(response.response.outputSpeech.text).to.equal("The next bus is in 16 minutes");
                done();
            }
        };
        EchoBus.handler(
            buildEvent("GetNextBusIntent", {
                "Route": {
                    "name": "Route",
                    "value": "145"
                }
            }), context);
    });

    it('should return the time of the next bus', function (done) {
        
        var context = {
            "succeed": function (response) {
                expect(response.response.outputSpeech.type).to.equal("SSML");
                expect(response.response.outputSpeech.ssml).to.equal('<speak>The next bus is at <say-as interpret-as="time">09:06 am</say-as></speak>')
                done();
            }
        };
        EchoBus.handler(
            buildEvent("GetNextBusTimeIntent", {
                "Route": {
                    "name": "Route",
                    "value": "145"
                }
            }), context);
    })

});
