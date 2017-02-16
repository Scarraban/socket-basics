var socket = io();
var $messages = jQuery('div#message-contents');
var $form = jQuery('#message-form');
var $title = jQuery('h1.room-title');

var name = getQueryVariable('name') || 'Stranger';
var room = getQueryVariable('room') || 'General';
$title.text('Room: ' + room);

socket.on('connect', function() {
  console.log('Connected to server');
  socket.emit('joinRoom', {
    name: name,
    room: room
  });
});

socket.on('message', function(message) {
  var ts = moment.utc(message.timestamp).local().format('h:mma');
  $messages.append('<p><strong>(' + ts + ') ' + message.name + ':</strong></p>');
  $messages.append('<p>' + message.text + '</p>');
  console.log(message.text);
});

// On sumbit of message

$form.on('submit', function(event) {
  event.preventDefault();
  $message = $form.find('input[name=message]');

  socket.emit('message', {
    text: $message.val(),
    name: name
  });

  $message.val('').focus();
});