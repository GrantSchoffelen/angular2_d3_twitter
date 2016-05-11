"use strict";
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
let stateCount = {
    "AL": {count: 0, filter1: 0, filter2:0},
    "AK": {count: 0, filter1: 0, filter2:0},
    "AS": {count: 0, filter1: 0, filter2:0},
    "AZ": {count: 0, filter1: 0, filter2:0},
    "AR": {count: 0, filter1: 0, filter2:0},
    "CA": {count: 0, filter1: 0, filter2:0},
    "CO": {count: 0, filter1: 0, filter2:0},
    "CT": {count: 0, filter1: 0, filter2:0},
    "DE": {count: 0, filter1: 0, filter2:0},
    "DC": {count: 0, filter1: 0, filter2:0},
    "FM": {count: 0, filter1: 0, filter2:0},
    "FL": {count: 0, filter1: 0, filter2:0},
    "GA": {count: 0, filter1: 0, filter2:0},
    "GU": {count: 0, filter1: 0, filter2:0},
    "HI": {count: 0, filter1: 0, filter2:0},
    "ID": {count: 0, filter1: 0, filter2:0},
    "IL": {count: 0, filter1: 0, filter2:0},
    "IN": {count: 0, filter1: 0, filter2:0},
    "IA": {count: 0, filter1: 0, filter2:0},
    "KS": {count: 0, filter1: 0, filter2:0},
    "KY": {count: 0, filter1: 0, filter2:0},
    "LA": {count: 0, filter1: 0, filter2:0},
    "ME": {count: 0, filter1: 0, filter2:0},
    "MH": {count: 0, filter1: 0, filter2:0},
    "MD": {count: 0, filter1: 0, filter2:0},
    "MA": {count: 0, filter1: 0, filter2:0},
    "MI": {count: 0, filter1: 0, filter2:0},
    "MN": {count: 0, filter1: 0, filter2:0},
    "MS": {count: 0, filter1: 0, filter2:0},
    "MO": {count: 0, filter1: 0, filter2:0},
    "MT": {count: 0, filter1: 0, filter2:0},
    "NE": {count: 0, filter1: 0, filter2:0},
    "NV": {count: 0, filter1: 0, filter2:0},
    "NH": {count: 0, filter1: 0, filter2:0},
    "NJ": {count: 0, filter1: 0, filter2:0},
    "NM": {count: 0, filter1: 0, filter2:0},
    "NY": {count: 0, filter1: 0, filter2:0},
    "NC": {count: 0, filter1: 0, filter2:0},
    "ND": {count: 0, filter1: 0, filter2:0},
    "MP": {count: 0, filter1: 0, filter2:0},
    "OH": {count: 0, filter1: 0, filter2:0},
    "OK": {count: 0, filter1: 0, filter2:0},
    "OR": {count: 0, filter1: 0, filter2:0},
    "PW": {count: 0, filter1: 0, filter2:0},
    "PA": {count: 0, filter1: 0, filter2:0},
    "PR": {count: 0, filter1: 0, filter2:0},
    "RI": {count: 0, filter1: 0, filter2:0},
    "SC": {count: 0, filter1: 0, filter2:0},
    "SD": {count: 0, filter1: 0, filter2:0},
    "TN": {count: 0, filter1: 0, filter2:0},
    "TX": {count: 0, filter1: 0, filter2:0},
    "UT": {count: 0, filter1: 0, filter2:0},
    "VT": {count: 0, filter1: 0, filter2:0},
    "VI": {count: 0, filter1: 0, filter2:0},
    "VA": {count: 0, filter1: 0, filter2:0},
    "WA": {count: 0, filter1: 0, filter2:0},
    "WV": {count: 0, filter1: 0, filter2:0},
    "WI": {count: 0, filter1: 0, filter2:0},
    "WY": {count: 0, filter1: 0, filter2:0}
};



// locations: '-124.848974, 24.396308, -66.885444, 49.384358'
var tweet = 100,
filter = 'nj, ny';

const states = new RegExp(/AL|Alabama|AK|Alaska|AZ|Arizona|AR|Arkansas|CA|California|CO|Colorado|CT|Connecticut|DE|Delaware|FL|Florida|GA|Georgia|HI|Hawaii|ID|Idaho|IL|Illinois|IN|Indiana|IA|Iowa|KS|Kansas|KY|Kentucky|LA|Louisiana|ME|Maine|MD|Maryland|MA|Massachusetts|MI|Michigan|MN|Minnesota|MS|Mississippi|MO|Missouri|MT|Montana|NE|Nebraska|NV|Nevada|NH|New Hampshire|NJ|New Jersey|NM|New Mexico|NY|New York|NC|North Carolina|ND|North Dakota|OH|Ohio|OK|Oklahoma|OR|Oregon|PA|Pennsylvania|RI|Rhode Island|SC|South Carolina|SD|South Dakota|TN|Tennessee|TX|Texas|UT|Utah|VT|Vermont|VA|Virginia|WA|Washington|WV|West Virginia|WI|Wisconsin|WY|Wyoming/);

function twitterStream(socket, _filter){
    client.stream('statuses/filter', { track: _filter }, function(stream) {
        stream.on('data', function(_tweet) {
            tweet = _tweet
            tweet.text = tweet.text.toLowerCase();
            if(tweet.place){
                if(tweet.place.full_name){
                    let tweetState = tweet.place.full_name.match(states);
                    if(tweetState){
                        tweet.state = tweetState[0];

console.log(tweet.text.search(_filter.split(',')[0]))

                        stateCount[tweet.state]['count'] += 1;
                        if(tweet.text.search(_filter.split(',')[0]) !== -1){
                            stateCount[tweet.state]['filter1'] += 1;
                            console.log('hit filter 1')
                        }
                        if(tweet.text.search(_filter.split(',')[1]) !== -1){
                            stateCount[tweet.state]['filter2'] += 1;
                            console.log('hit filter 2')
                        }

                        tweet.stateCount = stateCount[tweet.state]['count'];
                        tweet.filter1 = stateCount[tweet.state]['filter1'];
                        tweet.filter2 = stateCount[tweet.state]['filter2'];
                        if(tweet.filter1 < tweet.filter2){
                            tweet.fillKey ="HIGH";
                        }
                        else if(tweet.filter1 > tweet.filter2){
                            tweet.fillKey ="MEDIUM";
                        }
                        else{
                         tweet.fillKey ="LOW";
                        }


                        socket.broadcast.emit('tweetStream', tweet);
                    }
                }
            }
            return;
        });

        stream.on('error', function(error) {
            console.log(error, 'error')
        });
    })
}

io.on('connection', function(socket) {
    twitterStream(socket, filter)
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
