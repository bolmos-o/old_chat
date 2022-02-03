const ioClient = require("socket.io-client");
const socket = ioClient("ws://localhost:3000");
const readline = require('readline');
const { argv, stdin: input, stdout: output } = require('process');

if (!argv[2])
{
	console.log("Usage: node chat-client [USERNAME].");
	process.exit(1);
}

const user = argv[2];
const rl = readline.createInterface({ input, output, prompt: "me > " });

socket.on("connect", () => {
	socket.emit("set username", user);

	rl.prompt();
	rl.on('line', (input: string) => {
		socket.emit("message", input);
		rl.prompt();
	});

	socket.on("message", (message: string) => {
		const obj = JSON.parse(message);
		if (obj.username)
			console.log(obj.username + ": " + obj.content);
		else
			console.log(obj.content);
	});
});

socket.on("connect_error", () => {
	console.log("Impossible to connect to the server.");
	process.exit(1);
});