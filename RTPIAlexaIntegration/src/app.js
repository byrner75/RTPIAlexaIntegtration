var RTPIClient = require('./RTPIClient');
var EchoBus = require('./bus');
var winston = require("winston");
var nock = require('nock');
var client = new RTPIClient();
var event = {
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
            "name": "GetNextBusIntent",
            "slots": {
                "Route": {
                    "name": "Route",
                    "value": "145"
                }
            }
        },
        "locale": "en-US"
    },
    "version": "1.0"
};

var nokeResponse = {
    errorcode: '0',
    errormessage: '',
    numberofresults: 1,
    stopid: '4182',
    timestamp: '02/05/2016 08:49:32',
    results: [
        {
            arrivaldatetime: '02/05/2016 09:06:03',
            duetime: '16',
            departuredatetime: '02/05/2016 09:06:03',
            departureduetime: '16',
            scheduledarrivaldatetime: '02/05/2016 09:06:00',
            scheduleddeparturedatetime: '02/05/2016 09:06:00',
            destination: 'Heuston Station',
            destinationlocalized: 'Stáisiun Heuston',
            origin: 'Southern Cross',
            originlocalized: 'Southern Cross',
            direction: 'Inbound',
            operator: 'bac',
            additionalinformation: '',
            lowfloorstatus: 'no',
            route: '145',
            sourcetimestamp: '02/05/2016 08:07:19',
            monitored: 'true'
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

winston.level = "debug";
var rtpi = nock('https://data.dublinked.ie')
                .get('/cgi-bin/rtpi/realtimebusinformation')
                .query(true)
                .reply(200, nokeResponse);

var context = {
    "succeed": function (response) {
        winston.log("debug", response);
    }
};
EchoBus.handler(event, context);
/*
client.realtimeInformation("4182", "145", "bac", 3, function (json) {
    console.log(JSON.stringify(json, null, 2));
});*/