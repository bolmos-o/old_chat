const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
	res.sendFile(__dirname + "/public/client.html");
});

io.on('connection', (socket) => {
	console.log(socket.id + ' connected');
	socket.on('message', (msg) => {
		console.log('message: ' + msg);
		socket.broadcast.emit('message', msg);
	});
	socket.on('disconnect', () => {
		console.log(socket.id + " disconnected.")
	});
});

server.listen(port, () => console.log(`listen on ${port}`));