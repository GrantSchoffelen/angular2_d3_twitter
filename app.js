var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var app = express();

var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var config = require('config');
var twitter = require('twitter');

var client = new twitter(config.get('twitter'));

// console.log(config.get('twitter'))
server.listen(8000);
io.set("origins", "*:*");

var tweet = 100,
filter = 'apple';

function twitterStream(socket, _filter){
    client.stream('statuses/filter', { track: _filter }, function(stream) {
        stream.on('data', function(_tweet) {
            console.log(_tweet.text)
            tweet = _tweet.text
            socket.emit('tweetStream', tweet);
            socket.broadcast.emit('tweetStream', tweet);
        });

        stream.on('error', function(error) {
            console.log(error, 'error')
        });
    })
}

io.on('connection', function(socket) {
    // twitterStream(socket, filter)
    socket.on('newFilter', function(data) {
        twitterStream(socket, data)
    });
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/templates', express.static(__dirname + '/views/templates/'));
app.use('/scripts', express.static(__dirname + '/node_modules/'));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
