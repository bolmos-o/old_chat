const io = require("socket.io-client");
const socket = io("ws://localhost:3000");
const readline = require('readline');
const { argv, stdin: input, stdout: output } = require('process');

user = argv[2];
const rl = readline.createInterface({ input, output, prompt: "me> " });

socket.on("connect", () => {
	socket.emit("message", user + " is now online.");
	rl.prompt();
	rl.on('line', (input) => {
		socket.emit("message", user + ": " + input);
		rl.prompt();
	});
	socket.on("message", (msg) => {
		console.log(msg);
	});
});

socket.on("connect_error", () => {
	console.log("Impossible to connect to the server.");
	process.exit();
});