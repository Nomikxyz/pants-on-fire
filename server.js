var fs = require('fs');
var express = require('express');
var util = require('util');
var request = require('request');
var app = express();
var path = require('path');
var spawn = require("child_process").spawn;
app.use('/', express.static(path.join(__dirname, 'public')));

var server = app.listen(5000, function() {
  console.log('Server listening on port 5000');
});

var io = require('socket.io')(server);

io.on('connection', function(socket) {
  socket.on('newComment', function(comment, callback) {
    commentBody = (comment.text);
    console.log(commentBody);
    request({
      method: 'post',
      url: 'http://text-processing.com/api/sentiment/',
      form: {
        text: commentBody
      },

      json: true,
    }, function(error, response, body) {
      var label = body['label'];
      console.log(label);
    });

    var biasDetector = spawn('python', ["News-bias-detector/detect_bias.py", commentBody]);
    biasDetector.stdout.on('data', function(data) {
      var outputText = data.toString('utf8');
      console.log(outputText);
      //util.log(outputText);
    });
  });
});
