'use strict';

const e = React.createElement;

function appendMessage(message, own)
{
	let msg = JSON.parse(message);
	let item = document.createElement('li');
	if (own === true)
	{
		item.setAttribute("class", "user-message");
		item.innerHTML = "<span class=\"user-name\">"+ msg.username + "</span>\n" + msg.content;
	}
	else
	{
		if (msg.username)
			item.innerHTML = "<span class=\"other-name\">"+ msg.username + "</span>\n" + msg.content;
		else
			item.innerHTML = msg.content;
	}
	const l = document.getElementById('messages');
	l.appendChild(item);
	const j = document.getElementById('chat_messages');
	j.scrollTop = j.scrollHeight;
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
		appendMessage(JSON.stringify( {username: this.state.username, content: this.state.input }), true);
		socket.emit('message', this.state.input);
		this.setState({input: ''});
	}

	render() {
		if (this.state.username)
		{
			return e(
				'div', {id: "chat_page"},
				e('div', {id: "chat_messages"},
					e('ul', {id: "messages"})),
				e('form',
					{ id: "chat-form", action: "", onSubmit: this.chatSubmit},
					e('input',	{id: "chat_input", required: "text", 
								maxLength: "256", value: this.state.input,
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
					e('input', {required: "text", maxLength: "16", 
								value: this.state.input, 
								onChange: this.inputChange}),
					e('button', null, "Enter")
				)
			);
		}
	}
}

const socket = io();

socket.on("message", (message) => appendMessage(message, false));

ReactDOM.render(e(chat), document.getElementById('chat'));