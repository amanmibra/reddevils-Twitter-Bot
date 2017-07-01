console.log('The bot is working');

//packages needed
var Twit = require('twit');
var config = require('./config');
var fs = require('fs');
var request = require('request');
var http = require('http');

//global variables
var url = "https://www.reddit.com/r/reddevils/top.json?sort=top&t=hour&limit=1";
var permalink = '';
var T = new Twit(config);
var stream = T.stream('user');
var newRequest = false;

//streams
stream.on('follow', followed);
stream.on('tweet', replyToTweet)

redditRequest();

function followed(event) {
  var name = event.source.name;
  var handle = event.source.screen_name;

  console.log('I have been followed!');

  var followTweet = '@' + handle + ' Thanks for following me !';
  tweetIt(followTweet);
}

function tweetIt(input) {
  var tweet = {
    status: input
  };
  T.post('statuses/update', tweet, tweeted);
}

function tweeted(err, data, response) {
  if (err) {
    console.log('Not working at ' + new Date());
    console.log("ERROR: ", err.message);
  } else {
    console.log('It worked at ' + new Date());
  }
}

function redditRequest() {
  request(url, function(error, response, body) {
    newRequest = false;
    var redditResponse = JSON.parse(body);
    if (redditResponse.data.children.length > 0 && error == null) {
      permalink = redditResponse.data.children[0].data.permalink;
      var permaString = permalink.toString();
      var title = redditResponse.data.children[0].data.title.toString();
      title = titleChecker(title);
      var author = redditResponse.data.children[0].data.author.toString();
      hourlyTweet(permaString, author, title);
      setInterval(redditRequest, 1000 * 60 * 60);
    } else {
      newRedditRequest();
    }
  });
}

function newRedditRequest() {
  newRequest = true;
  var newURL = "https://www.reddit.com/r/reddevils/new.json?limit=1";
  request(newURL, function(newError, newResponse, newBody) {
    if (newError == null) {
      var newRedditResponse = JSON.parse(newBody);
      var newPermalink = newRedditResponse.data.children[0].data.permalink.toString();
      var newTitle = newRedditResponse.data.children[0].data.title.toString();
      newTitle = titleChecker(newTitle);
      var author = newRedditResponse.data.children[0].data.author.toString();
      hourlyTweet(newPermalink, author, newTitle);
      setInterval(redditRequest, 1000 * 60 * 60);
    } else {
      console.log('Last case scenario', newError);
    }
  });

}

function hourlyTweet(permalink, author, title) {
  console.log('perma ', permalink);
  var reddevilsTweet = "\"" + title + "\" - /u/" + author + "\n" + "reddit.com" + permalink;
  console.log(reddevilsTweet)

  var params = {
    screen_name: "reddevilsbot",
    count: 1
  }
  T.get('statuses/user_timeline', params, function(err, data, response) {
    for (var j = 0; j < 1; j++) {
      if (data[j].text.substring(0, 10) == reddevilsTweet.substring(0, 10)) {
        console.log('Caught Duplicate');
        if (!newRequest) {
          newRedditRequest();
        }
        return;
      }
    }
    tweetIt(reddevilsTweet);
  });
  setInterval(redditRequest, 1000 * 60 * 60);
}

function replyToTweet(event) {
  console.log('EVENT ---- ', event)

  var replyTo = event.in_reply_to_screen_name;
  var text = event.text;
  var from = event.user.screen_name;
  var fromTweet = event.text;
  var fromTweetLwrcse = fromTweet.toLowerCase();
  var tweetID = event.id_str;

  var randNumChecker = fromTweetLwrcse.search("random") != -1 && fromTweetLwrcse.search("number") != -1;

  if ((replyTo == "reddevilsbot" || text.search("@reddevilsbot") != -1) && from != "reddevilsbot") {
    if (randNumChecker) {
      var number = Math.round(Math.random() * 100);
      var tweetMsg = '@' + from + ' ' + number;
      var newTweet = {
        status: tweetMsg,
        in_reply_to_status_id: tweetID
      }
      T.post('statuses/update', newTweet, tweeted);
    } else {
      var tweetMsg = '@' + from + ' Thanks for tweeting me!'
      var newTweet = {
        status: tweetMsg,
        in_reply_to_status_id: tweetID
      }
      T.post('statuses/update', newTweet, tweeted);
    }
  }
}

function titleChecker(title) {
  if (title.length > 70) {
    words = title.split(' ');
    title = '';
    words.forEach(function(word) {
      if (title.length > 70) {
        return;
      }
      if (title == '') {
        title = word;
      } else {
        title = title + ' ' + word;
      }
    });
  } else {
    return title;
  }
  return title + "...";
}

function makeMediaPost(filename, msg) {
  var params = {
    encoding: "base64"
  };
  var b64 = fs.readFileSync(filename, params);

  T.post('media/upload', {
    media_data: b64
  }, uploaded);

  function uploaded(err, data, response) {
    var id = data.media_id_string;
    var media_tweet = {
      status: msg,
      media_ids: [id]
    }

    T.post('statuses/update', media_tweet, tweeted);
  }
}
