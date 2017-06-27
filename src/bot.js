console.log('The bot is working');

var Twit = require('twit');
var config = require('./config');

var T = new Twit(config);

var tweet = {
  status: "Hello World! I am Aman's bot. Follow him @amanmibra!"
}

T.post('statuses/update', tweet, tweeted);

function tweeted(err, data, response) {
  if(err){
    console.log("Not working")
  } else{
    console.log('It worked!')
  }
}
