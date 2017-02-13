var express = require('express');

var app = express();
var PORT = process.env.PORT || 3000;
var http = require('http').Server(app);

app.use(express.static(__dirname + '/public'));

http.listen(PORT, function() {
	console.log('Server listening on port: ' + PORT);
});