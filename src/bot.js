console.log('The bot is working');

var Twit = require('twit');
var config = require('./config');

var T = new Twit(config);
