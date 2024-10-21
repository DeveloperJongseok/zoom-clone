import express from 'express';
// import WebSocket, { WebSocketServer } from 'ws';
import { Server } from 'socket.io';
import http from 'http';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));

const handleListen = () => console.log('Listening on http://localhost:3000');

// app.listen(3000, handleListen);

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;

  const publicRoomList = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRoomList.push(key);
    }
  });
  return publicRoomList;
}

function countUser(room) {
  return wsServer.sockets.adapter.rooms.get(room).size;
}

wsServer.on('connection', (socket) => {
  wsServer.sockets.emit('room_change', publicRooms());
  socket['username'] = 'Unknown';
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });

  socket.on('enter_room', (room, name, done) => {
    socket.join(room);
    socket['username'] = name;
    done(countUser(room));
    socket.to(room).emit('welcome', socket.username, countUser(room));
    wsServer.sockets.emit('room_change', publicRooms());
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit('bye', socket.username, countUser(room) - 1)
    );
  });

  socket.on('disconnect', () => {
    wsServer.sockets.emit('room_change', publicRooms());
  });

  socket.on('new_message', (room, msg, done) => {
    socket.to(room).emit('new_message', `${socket.username}: ${msg}`);
    done();
  });
});

// const wss = new WebSocketServer({ server });

// const sockets = [];

// wss.on('connection', (socket) => {
//   sockets.push(socket);
//   socket['username'] = 'Unknown';
//   console.log('Connected to Browser');
//   socket.on('close', () => {
//     console.log('Disconnected from the Browser');
//   });
//   socket.on('message', (msg) => {
//     const messageString = msg.toString('utf8');
//     const message = JSON.parse(messageString);
//     switch (message.type) {
//       case 'message':
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.username}: ${message.payload}`)
//         );
//         break;
//       case 'username':
//         console.log(message);
//         socket['username'] = message.payload;
//         break;
//     }
//   });
// });

httpServer.listen(3000, handleListen);
