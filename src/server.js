import express from 'express';
// import WebSocket, { WebSocketServer } from 'ws';
import { Server } from 'socket.io';
import http from 'http';
import { Socket } from 'dgram';

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

wsServer.on('connection', (socket) => {
  socket.on('enter_room', (msg, hi) => {
    console.log(msg);
    hi();
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
