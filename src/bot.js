console.log('The bot is working');
var Twit = require('twit');
var config = require('./config');
var fs = require('fs');

var T = new Twit(config);
var stream = T.stream('user');

stream.on('follow', followed);
var filename = "../images/gort.jpg";
var msg = "This picture is so good, I will post it twice! #Gort";
makeMediaPost(filename, msg);

function makeMediaPost(filename, msg){
  var params = {
    encoding: "base64",
  };
  var b64 = fs.readFileSync(filename, params);

  T.post('media/upload', { media_data: b64 }, uploaded);

  function uploaded(err, data, response){
    var id = data.media_id_string;
    var media_tweet = {
      status: msg,
      media_ids: [id],
    }

    T.post('statuses/update', media_tweet, tweeted);
  }
}

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
}

function tweeted(err, data, response) {
  if (err) {
    console.log('Not working');
  } else {
    console.log('It worked!');
  }
}
