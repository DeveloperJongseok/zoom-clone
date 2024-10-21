// const messageList = document.querySelector('ul');
// const messageForm = document.getElementById('message');
// const usernameForm = document.getElementById('username');

// const socket = new WebSocket(`ws://${window.location.host}`);

// function translator(type, payload) {
//   const msg = { type, payload };
//   return JSON.stringify(msg);
// }

// socket.addEventListener('open', () => {
//   console.log('Connected to Server');
// });

// socket.addEventListener('message', (message) => {
//   const li = document.createElement('li');
//   li.innerText = message.data;
//   messageList.appendChild(li);
// });

// socket.addEventListener('close', () => {
//   console.log('Disconnected from Server');
// });

// // Chat
// messageForm.addEventListener('submit', (event) => {
//   event.preventDefault();
//   const input = messageForm.querySelector('input');
//   socket.send(translator('message', input.value));
//   const li = document.createElement('li');
//   li.innerText = `You: ${input.value}`;
//   messageList.appendChild(li);
//   input.value = '';
// });

// usernameForm.addEventListener('submit', (event) => {
//   event.preventDefault();
//   const input = usernameForm.querySelector('input');
//   socket.send(translator('username', input.value));
//   input.value = '';
// });\

const socket = io();

const enter = document.getElementById('enter');
const enterForm = enter.querySelector('form');
const room = document.getElementById('room');
const roomForm = room.querySelector('form');

let roomName;

room.hidden = true;

function showRoom() {
  enter.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerText = roomName;
}

function addMessage(msg) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');

  li.innerText = msg;
  ul.appendChild(li);
}

enterForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const input = enterForm.querySelector('input');
  socket.emit('enter_room', input.value, showRoom);
  roomName = input.value;
  input.value = '';
});

socket.on('welcome', () => {
  addMessage('Someone joined.');
});
