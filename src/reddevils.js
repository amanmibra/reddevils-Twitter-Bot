var request = require('request');
var http = require('http');

module.exports =  function makeRequest() {
    var url = "http://www.reddit.com/r/reddevils/top.json?sort=top&t=day&limit=1";
    var permalink = '';

    request(url, function(error, response, body) {
      var redditResponse = JSON.parse(body);
      permalink = redditResponse.data.children[0].data.permalink;
    });
    return permalink.toString();
  }

// http.get(url, function(res){
//     var body = '';
//
//     res.on('data', function(chunk){
//         body += chunk;
//     });
//
//     res.on('end', function(){
//         var redditResponse = JSON.parse(body);
//         console.log("Got a response: ", redditResponse);
//     });
// }).on('error', function(e){
//       console.log("Got an error: ", e);
// });
