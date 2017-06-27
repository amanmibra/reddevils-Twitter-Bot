console.log('The bot is working');
var Twit = require('twit');
var config = require('./config');

var T = new Twit(config);
var stream = T.stream('user');

stream.on('follow', followed);

function followed(event) {
  var name = event.source.name;
  var handle = event.source.screen_name;

  console.log('I have been followed!');

  var followTweet = 'Thanks for following me @' + handle + '!';
  tweetIt(followTweet);
}

function tweetIt(input) {
  var tweet = {
    status: input,
  };

  T.post('statuses/update', tweet, tweeted);

  function tweeted(err, data, response) {
    if (err) {
      console.log('Not working');
    } else {
      console.log('It worked!');
    }
  }
}
