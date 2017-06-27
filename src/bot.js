console.log('The bot is working');

var Twit = require('twit');
var config = require('./config');

var T = new Twit(config);

var search = {
  q: 'Manchester United',
  count: 11
};

T.get('search/tweets', search, getTweets);


function getTweets(err, data, response) {
  var statuses = data.statuses;
  for(var i = 0; i < statuses.length; i++){
    var tweet = statuses[i].text;
    console.log((i+1) + ") " + tweet);
    if(i == statuses.length - 1) break;
    console.log("------------")
  }
}
