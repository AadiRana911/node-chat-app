var socket = io();

socket.on('connect', function(){
    console.log(`Connected to server`);
});

socket.on('disconnect', function(){
    console.log(`Disconnected from server`);
});

function scrollToBottom() {
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');

    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight()
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();

    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
    
    // console.log('newMessage', message);
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}:${message.text}`);
    // jQuery('#messages').append(li);
});

var messageTextBox = jQuery('[name=message]');

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();

    socket.emit('createMessage',{
        from: 'User',
        text: messageTextBox.val()
    })
});