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
const messageForm = room.querySelector('form');

let roomName;

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector('input');
  const msg = input.value;
  socket.emit('new_message', roomName, msg, () => {
    addMessage(`You: ${msg}`);
  });
  input.value = '';
}

function handleEnterRoom(event) {
  event.preventDefault();

  const roomInput = enterForm.querySelector('#room_name');
  const usernameInput = enterForm.querySelector('#username');

  roomName = roomInput.value;
  socket.emit('enter_room', roomName, usernameInput.value, showRoom);

  roomInput.value = '';
  usernameInput.value = '';
}

function showRoom() {
  enter.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerText = roomName;

  messageForm.addEventListener('submit', handleMessageSubmit);
}

function addMessage(msg) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');

  li.innerText = msg;
  ul.appendChild(li);
}

socket.on('welcome', (name) => {
  addMessage(`${name} joined.`);
});

socket.on('bye', (name) => {
  addMessage(`${name} left.`);
});

socket.on('new_message', addMessage);

socket.on('room_change', (rooms) => {
  const roomList = document.getElementById('room_list');
  roomList.innerHTML = '';
  if (rooms.length === 0) {
    return;
  }

  rooms.forEach((room) => {
    const li = document.createElement('li');
    li.innerText = room;
    roomList.append(li);
  });
});

room.hidden = true;
enterForm.addEventListener('submit', handleEnterRoom);
