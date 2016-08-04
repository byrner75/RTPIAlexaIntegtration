'use strict';

var https = require('https');

function RTPIClient() {
}

RTPIClient.execute = function (options, callbackOk, callbackErr) {
    https.request(options, function (response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            if (response.statusCode === 200) {
                callbackOk && callbackOk(JSON.parse(str));
            }
            else {
                callbackErr && callbackErr(response);
            }
        });
    }).end();
}


RTPIClient.prototype.operatorInformation = function(callbackOk, callbackErr) {
    var options = {
        host: 'data.dublinked.ie',
        path: '/cgi-bin/rtpi/operatorinformation?format=json'
    };
    RTPIClient.execute(options, callbackOk, callbackErr);
}

RTPIClient.prototype.realtimeInformation = function(stopId, routeId, operator, maxResults, callbackOk, callbackErr) {
    var options = {
        host: 'data.dublinked.ie',
        path: '/cgi-bin/rtpi/realtimebusinformation?format=json&stopid=' 
              + stopId 
              + (routeId != null ? '&routeid=' + routeId : '') 
              + (operator != null ? '&operator=' + operator : '')
              + (maxResults != null ? '&maxresults=' + maxResults : '')
    };
    RTPIClient.execute(options, callbackOk, callbackErr);
}

RTPIClient.prototype.timetableDayInformation = function(stopId, routeId, dateTime, callbackOk, callbackErr) {
    var options = {
        host: 'data.dublinked.ie',
        path: '/cgi-bin/rtpi/timetableinformation?format=json&type=day&stopid=' 
              + stopId 
              + (routeId != null ? '&routeid=' + routeId : '') 
              + (dateTime != null ? '&datetime=' + encodeURIComponent(dateTime) : '')
    };
    RTPIClient.execute(options, callbackOk, callbackErr);
}

RTPIClient.prototype.timetableWeekInformation = function(stopId, routeId, callbackOk, callbackErr) {
    var options = {
        host: 'data.dublinked.ie',
        path: '/cgi-bin/rtpi/timetableinformation?format=json&type=week&stopid=' 
              + stopId 
              + (routeId != null ? '&routeid=' + routeId : '')
    };
    RTPIClient.execute(options, callbackOk, callbackErr);
}

RTPIClient.prototype.busstopInformation = function(stopId, stopName, operator, callbackOk, callbackErr) {
    var options = {
        host: 'data.dublinked.ie',
        path: '/cgi-bin/rtpi/busstopinformation?format=json' 
              + (stopId != null ? '&stopid=' + stopId.toString() : '')
              + (stopName != null ? '&stopname=' + stopName : '')
              + (operator != null ? '&operator=' + operator : '')
    };
    RTPIClient.execute(options, callbackOk, callbackErr);
}

RTPIClient.prototype.routeInformation = function(routeId, operator, callbackOk, callbackErr) {
    var options = {
        host: 'data.dublinked.ie',
        path: '/cgi-bin/rtpi/routeinformation?format=json&routeid=' + routeId + '&operator=' + operator 
    };
    RTPIClient.execute(options, callbackOk, callbackErr);
}

RTPIClient.prototype.routeListInformation = function(operator, callbackOk, callbackErr) {
    var options = {
        host: 'data.dublinked.ie',
        path: '/cgi-bin/rtpi/routelistinformation?format=json&operator=' + operator
    };    
    RTPIClient.execute(options, callbackOk, callbackErr);
}

module.exports = RTPIClient;