var request = require('ajax-request');
var http = require('http');

var url = "http://www.reddit.com/r/reddevils/top.json?sort=top&t=day&limit=1";

http.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var redditResponse = JSON.parse(body);
        console.log("Got a response: ", redditResponse);
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});
