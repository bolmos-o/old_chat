const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('message', (msg) => {
		console.log('message: ' + msg);
		socket.broadcast.emit('message', msg);
	});
});

server.listen(port, () => console.log(`listen on ${port}`));