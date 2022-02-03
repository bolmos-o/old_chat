const path = require('path')
const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, '../public')));
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/client.html'));
});

io.on('connection', (socket) => {
	socket.on('message', (msg) => {
		console.log(msg);
		socket.broadcast.emit('message', msg);
	});
});

server.listen(port, () => console.log(`listen on ${port}`));