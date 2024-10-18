import express from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));

const handleListen = () => console.log('Listening on http://localhost:3000');

// app.listen(3000, handleListen);

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

const sockets = [];

wss.on('connection', (socket) => {
  sockets.push(socket);
  socket['username'] = 'Unknown';
  console.log('Connected to Browser');
  socket.on('close', () => {
    console.log('Disconnected from the Browser');
  });
  socket.on('message', (msg) => {
    const messageString = msg.toString('utf8');
    const message = JSON.parse(messageString);
    switch (message.type) {
      case 'message':
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.username}: ${message.payload}`)
        );
        break;
      case 'username':
        console.log(message);
        socket['username'] = message.payload;
        break;
    }
  });
});

server.listen(3000, handleListen);
