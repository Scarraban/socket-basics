var express = require('express');

var app = express();
var PORT = process.env.PORT || 3000;
var http = require('http').Server(app);

var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

// Sends current users to provided socket
function sendCurrentUsers(socket) {
  var client = clientInfo[socket.id];
  var users = [];

  if(typeof client === 'undefined') {
    return;
  }

  Object.keys(clientInfo).forEach(function(socketId) {
    var info = clientInfo[socketId];
    if(info.room === client.room) {
      users.push(info.name);
    }
  });

  socket.emit('message', {
    name: 'Server',
    text: 'Current users: ' + users.join(', '),
    timestamp: moment().valueOf()
  });
}

io.on('connection', function(socket) {
  console.log('User connected via socket.io');

  socket.on('disconnect', function() {
    var userData = clientInfo[socket.id];
    if (typeof userData !== 'undefined') {
      socket.leave(userData.room);
      io.to(userData.room).emit('message', {
        name: 'Server',
        text: userData.name + ' has left the chat room!',
        timestamp: moment().valueOf()
      });
      delete clientInfo[socket.id];
    }
  });

  socket.on('joinRoom', function(req) {
    clientInfo[socket.id] = req;
    socket.join(req.room);
    socket.broadcast.to(req.room).emit('message', {
      name: 'Server',
      text: req.name + ' joined the chat room!',
      timestamp: moment().valueOf()
    });
  });

  socket.on('message', function(message) {
    console.log('Message receieved: ' + message.text);

    if (message.text === '@currentUsers') {
      console.log('Users request receieved');
      sendCurrentUsers(socket);
    } else {
      message.timestamp = moment().valueOf();
      io.to(clientInfo[socket.id].room).emit('message', message);
    }

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