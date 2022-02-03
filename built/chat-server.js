var path = require('path');
var express = require('express');
var app = express();
var port = 3000;
var http = require('http');
var server = http.createServer(app);
var Server = require("socket.io").Server;
var io = new Server(server);
app.use(express.static(path.join(__dirname, '../public')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/client.html'));
});
io.on('connection', function (socket) {
    socket.on('message', function (msg) {
        console.log(msg);
        socket.broadcast.emit('message', msg);
    });
});
server.listen(port, function () { return console.log("listen on ".concat(port)); });
