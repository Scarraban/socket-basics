var socket = io();
var $messages = jQuery('div#message-contents');
var $form = jQuery('#message-form');

socket.on('connect', function() {
	console.log('Connected to server');
});

socket.on('message', function(message) {
  $messages.append('<p>Stranger: ' + message.text + '</p>');
	console.log(message.text);
});

// On sumbit of message

$form.on('submit', function(event) {
  event.preventDefault();
  $message = $form.find('input[name=message]');

  socket.emit('message', {
    text: $message.val()
  });


  $messages.append('<p>Me: ' + $message.val() + '</p>');
  $message.val('').focus();
});