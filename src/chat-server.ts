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
	socket.on('message', (message: string) => {
		console.log(socket.username + ': ' + message);
		socket.broadcast.emit('message', JSON.stringify({ username: socket.username, content: message }));
	});
	socket.on('set username', (username: string) => {
		socket.username = username;
		socket.broadcast.emit('message', JSON.stringify({ username: "", content: username + ' has entered the room.' }));
		console.log(username + ' has entered the room.');
	});
	socket.on('disconnect', () => {
		if (socket.username)
		{
			io.emit('message', JSON.stringify({ user: "", content: socket.username + ' has left the room.' }));
			console.log(socket.username + ' has left the room.');
		}
		else
		{
			io.emit('message', JSON.stringify({ user: "", content: 'Anonymous has left the room.' }));
			console.log('Anonymous has left the room.');
		}
	});
});
server.listen(port, () => console.log(`listen on ${port}`));