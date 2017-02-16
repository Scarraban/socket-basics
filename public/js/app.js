var socket = io();
var $messages = jQuery('div#message-contents');
var $form = jQuery('#message-form');

var name = getQueryVariable('name') || 'Stranger';
var room = getQueryVariable('room');
$messages.append(name + ' joined ' + room);

socket.on('connect', function() {
	console.log('Connected to server');
});

socket.on('message', function(message) {
  var ts = moment.utc(message.timestamp).local().format('h:mma');
  $messages.append('<p><strong>(' + ts + ') '+message.name+':</strong></p>');
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

  ts = moment.utc(moment().valueOf()).local().format('h:mma');
  $messages.append('<p><strong>(' + ts + ') '+name+': </strong></p>');
  $messages.append('<p>'+ $message.val() + '</p>');
  $message.val('').focus();
});