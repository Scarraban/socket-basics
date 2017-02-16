var express = require('express');

var app = express();
var PORT = process.env.PORT || 3000;
var http = require('http').Server(app);

var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
	console.log('User connected via socket.io');

	socket.on('message', function(message) {
		console.log('Message receieved: ' + message.text);
    message.timestamp = moment().valueOf();

		socket.broadcast.emit('message', message);
	});

	socket.emit('message', {
    name: 'Server',
		text: 'Welcome to the chat application!',
    timestamp: moment().valueOf()
	});
});

http.listen(PORT, function() {
	console.log('Server listening on port: ' + PORT);
});