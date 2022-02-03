var ioClient = require("socket.io-client");
var socket = ioClient("ws://localhost:3000");
var readline = require('readline');
var _a = require('process'), argv = _a.argv, input = _a.stdin, output = _a.stdout;
if (!argv[2]) {
    console.log("Usage: node chat-client [USERNAME].");
    process.exit(1);
}
var user = argv[2];
var rl = readline.createInterface({ input: input, output: output, prompt: "me> " });
socket.on("connect", function () {
    socket.emit("message", user + " is now online.");
    rl.prompt();
    rl.on('line', function (input) {
        socket.emit("message", user + ": " + input);
        rl.prompt();
    });
    socket.on("message", function (msg) {
        console.log(msg);
    });
    socket.on("disconnect", function () {
        socket.emit("message", user + " is now offline.");
    });
});
socket.on("connect_error", function () {
    console.log("Impossible to connect to the server.");
    process.exit(1);
});
