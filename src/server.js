var restify = require('restify');
var winston = require('winston');
winston.level = 'debug';
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {'timestamp':true, 'colorize':true, 'json': false});
 
var bus = require('./bus-alexa-sdk');

var server = restify.createServer();
server.use(restify.bodyParser());

// create a /alexa endpoint that receives  POST
// us ngrok to expose this as https://robtest.ngrok.io/alexa
// register this endpoint with Amazon
server.post('/alexa', function(req, res, next) {
    winston.info('Incoming request...');
    winston.info(req.body);
    // handler takes a context object with succeed and fail handlers
    bus.handler(req.body, {
        succeed: function(speakOut) {
            winston.info('responding....');
            winston.info(speakOut);
            res.send(speakOut);
        },
        fail: function(error) {
            winston.error(error);
        }
    });
    next();
});


server.listen(8080, function() {
    winston.info('%s listening at %s', server.name, server.url);
})