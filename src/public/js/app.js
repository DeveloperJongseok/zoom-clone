// NOTE: Chat basic
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

// NOTE: Chat [socket.io]
// const socket = io();

// const enter = document.getElementById('enter');
// const enterForm = enter.querySelector('form');
// const room = document.getElementById('room');
// const messageForm = room.querySelector('form');
// const h3 = room.querySelector('h3');

// let roomName;

// function handleMessageSubmit(event) {
//   event.preventDefault();
//   const input = room.querySelector('input');
//   const msg = input.value;
//   socket.emit('new_message', roomName, msg, () => {
//     addMessage(`You: ${msg}`);
//   });
//   input.value = '';
// }

// function handleEnterRoom(event) {
//   event.preventDefault();

//   const roomInput = enterForm.querySelector('#room_name');
//   const usernameInput = enterForm.querySelector('#username');

//   roomName = roomInput.value;
//   socket.emit('enter_room', roomName, usernameInput.value, showRoom);

//   roomInput.value = '';
//   usernameInput.value = '';
// }

// function showRoom(count) {
//   enter.hidden = true;
//   room.hidden = false;
//   countUser(count);
//   messageForm.addEventListener('submit', handleMessageSubmit);
// }

// function countUser(count) {
//   h3.innerText = `${roomName} (${count})`;
// }

// function addMessage(msg) {
//   const ul = room.querySelector('ul');
//   const li = document.createElement('li');

//   li.innerText = msg;
//   ul.appendChild(li);
// }

// socket.on('welcome', (name, count) => {
//   addMessage(`${name} joined.`);
//   countUser(count);
// });

// socket.on('bye', (name, count) => {
//   addMessage(`${name} left.`);
//   countUser(count);
// });

// socket.on('new_message', addMessage);

// socket.on('room_change', (rooms, count) => {
//   const roomList = document.getElementById('room_list');
//   roomList.innerHTML = '';
//   if (rooms.length === 0) {
//     return;
//   }

//   rooms.forEach((room) => {
//     const li = document.createElement('li');
//     li.innerText = `${room}`;
//     roomList.append(li);
//   });
// });

// room.hidden = true;
// enterForm.addEventListener('submit', handleEnterRoom);

const socket = io();

const video = document.getElementById('video');
const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');
const cameraSelect = document.getElementById('cameras');

let stream;
let muted = false;
let cameraOff = false;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === 'videoinput');
    const currentCamera = stream.getVideoTracks()[0].label;

    cameras.forEach((camera) => {
      const cameraOption = document.createElement('option');
      cameraOption.value = camera.deviceId;
      cameraOption.innerText = camera.label;

      if (currentCamera === camera.label) {
        cameraOption.selected = true;
      }
      cameraSelect.append(cameraOption);
    });
    console.log(cameras);
  } catch (error) {
    console.log(error);
  }
}

async function getMedia(deviceId) {
  const initialConstraints = {
    audio: true,
    video: { facingMode: 'user' },
  };

  const cameraConstraints = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    stream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstraints
    );
    video.srcObject = stream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (error) {
    console.log(error);
  }
}

function handleMute() {
  stream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
  if (muted) {
    muteBtn.innerText = 'Mute';
    muted = false;
  } else {
    muteBtn.innerText = 'Unmute';
    muted = true;
  }
}

function handleCamera() {
  stream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
  if (cameraOff) {
    cameraBtn.innerText = 'Camera Off';
    cameraOff = false;
  } else {
    cameraBtn.innerText = 'Camera On';
    cameraOff = true;
  }
}

async function handleCameraChange() {
  await getMedia(cameraSelect.value);
}

getMedia();

muteBtn.addEventListener('click', handleMute);
cameraBtn.addEventListener('click', handleCamera);
cameraSelect.addEventListener('input', handleCameraChange);
