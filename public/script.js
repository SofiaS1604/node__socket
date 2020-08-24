const socket = io('http://localhost:8080');

const $ = el => document.querySelector(el);
const createEl = el => document.createElement(el);

socket.on('room-created', roomName => {
    let div = createEl('div');
    div.innerHTML = `<div>${roomName}</div>
         <a href="/${roomName}">Join</a>`;
    $('.rooms').appendChild(div);
});

let appendMessage = (message) => {
    let div = createEl('div');
    div.innerText = message;
    $('#message-container').appendChild(div);
};

if($('#send-container') != null){
    const name = prompt('What is your name?');
    appendMessage('You joined');
    socket.emit('new-user', roomName, name);

    $('#send-container').addEventListener('submit', (e) => {
        e.preventDefault();
        const message = $('#message-input').value;
        appendMessage(`You: ${message}`);

        socket.emit('send-chat-message', roomName, message);
        $('#message-input').value = '';
    })
}

socket.on('user-connected', (name) => {
    appendMessage(`${name} connected`)
});

socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`)
});

socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`);
});