'use strict';

const e = React.createElement;

function appendMessage(message, own)
{
	let item = document.createElement('li');
	if (own === true)
		item.setAttribute("class", "user");

	// let user = document.createElement('span');
		// li.setAttribute("class", "username");
	// user.textContent = "huhu";
	// item.appendChild(user);
	item.textContent = message;
	chat_messages.appendChild(item);
}

class chat extends React.Component {
	constructor(props) {
		super(props);
		this.state = { username: '', input: ''};
		
		this.usernameSubmit = this.usernameSubmit.bind(this);
		this.chatSubmit = this.chatSubmit.bind(this);
		this.inputChange = this.inputChange.bind(this);
	}

	inputChange(e){
		this.setState({input: e.target.value});
	}

	usernameSubmit(e) {
		e.preventDefault();
		if (this.state.input)
		{
			this.setState({username: this.state.input, input: ''})
		 	socket.emit('set username', this.state.input);
		}
	}

	chatSubmit(e) {
		e.preventDefault();
		appendMessage(this.state.username + "\n" + this.state.input, true);
		socket.emit('message', this.state.input);
		this.setState({input: ''});
	}

	render() {
		if (this.state.username)
		{
			return e(
				'div', {id: "chat_page"},
				e('ul', {id: "chat_messages"}),
				e('form',
					{action: "", onSubmit: this.chatSubmit},
					e('input',	{id: "chat_input", required: "text", 
								maxlength: "256", value: this.state.input,
								onChange: this.inputChange}),
					e('button',	null,"Send")));
		}
		else
		{
			return e(
				'div', {id: "welcome_page"},
				e('h4', null, "Welcome to the chat."),
				e('form', { id: "username_form", onSubmit: this.usernameSubmit},
					e('p', null, "Choose a username: "),
					e('input', {required: "text", maxlength: "16", 
								value: this.state.input, 
								onChange: this.inputChange}),
					e('button', null, "Enter")
				)
			);
		}
	}
}

const socket = io();

socket.on("message", (message) => 
{
	const obj = JSON.parse(message);
	if (obj.username)
		appendMessage(obj.username + "\n" + obj.content, false);
	else
		appendMessage(obj.content, false);
});

ReactDOM.render(e(chat), document.getElementById('chat'));