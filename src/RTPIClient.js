'use strict';

var https = require('https');
var Q = require('q');
function RTPIClient() {
}

RTPIClient.execute = function (options) {
    var deferred = Q.defer();
    https.request(options, function (response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            if (response.statusCode === 200) {
                deferred.resolve(JSON.parse(str));
            }
            else {
                deferred.reject(response);
            }
        });
    }).end();
    return deferred.promise;
}


RTPIClient.prototype.operatorInformation = function() {
    var options = {
        host: 'data.dublinked.ie',
        path: '/cgi-bin/rtpi/operatorinformation?format=json'
    };
    return RTPIClient.execute(options);
}

RTPIClient.prototype.realtimeInformation = function(stopId, routeId, operator, maxResults) {
    var options = {
        host: 'data.dublinked.ie',
        path: '/cgi-bin/rtpi/realtimebusinformation?format=json&stopid=' 
              + stopId 
              + (routeId != null ? '&routeid=' + routeId : '') 
              + (operator != null ? '&operator=' + operator : '')
              + (maxResults != null ? '&maxresults=' + maxResults : '')
    };
    return RTPIClient.execute(options);
}

RTPIClient.prototype.timetableDayInformation = function(stopId, routeId, dateTime) {
    var options = {
        host: 'data.dublinked.ie',
        path: '/cgi-bin/rtpi/timetableinformation?format=json&type=day&stopid=' 
              + stopId 
              + (routeId != null ? '&routeid=' + routeId : '') 
              + (dateTime != null ? '&datetime=' + encodeURIComponent(dateTime) : '')
    };
    return RTPIClient.execute(options);
}

RTPIClient.prototype.timetableWeekInformation = function(stopId, routeId) {
    var options = {
        host: 'data.dublinked.ie',
        path: '/cgi-bin/rtpi/timetableinformation?format=json&type=week&stopid=' 
              + stopId 
              + (routeId != null ? '&routeid=' + routeId : '')
    };
    return RTPIClient.execute(options);
}

RTPIClient.prototype.busstopInformation = function(stopId, stopName, operator) {
    var options = {
        host: 'data.dublinked.ie',
        path: '/cgi-bin/rtpi/busstopinformation?format=json' 
              + (stopId != null ? '&stopid=' + stopId.toString() : '')
              + (stopName != null ? '&stopname=' + stopName : '')
              + (operator != null ? '&operator=' + operator : '')
    };
    return RTPIClient.execute(options);
}

RTPIClient.prototype.routeInformation = function(routeId, operator) {
    var options = {
        host: 'data.dublinked.ie',
        path: '/cgi-bin/rtpi/routeinformation?format=json&routeid=' + routeId + '&operator=' + operator 
    };
    return RTPIClient.execute(options);
}

RTPIClient.prototype.routeListInformation = function(operator) {
    var options = {
        host: 'data.dublinked.ie',
        path: '/cgi-bin/rtpi/routelistinformation?format=json&operator=' + operator
    };    
    return RTPIClient.execute(options);
}

module.exports = RTPIClient;