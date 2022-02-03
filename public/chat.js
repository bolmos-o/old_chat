'use strict';

const e = React.createElement;

function appendMessage(message)
{
	let item = document.createElement('li');
	item.textContent = message;
	messages.appendChild(item);
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
		 	socket.emit("message", this.state.input + " is now online.");
		}
	}

	chatSubmit(e) {
		e.preventDefault();
		if (this.state.input)
		{
			let msg = this.state.username + ": " + this.state.input;
			appendMessage(msg);
			socket.emit('message', msg);
			this.setState({input: ''});
		}
	}

	render() {
		if (this.state.username)
		{
			return e(
				'div', null,
				e('ul', {id: "messages"}),
				e('form',
					{action: "", id: "chat_input", onSubmit: this.chatSubmit},
					e('input', {value: this.state.input, onChange: this.inputChange}),
					e('button',	null,"Send")));
		}
		else
		{
			return e(
				'div', null,
				e('h4', null, "Choose a username: "),
				e('form', { id: "username_form", onSubmit: this.usernameSubmit},
					e('input', {value: this.state.input, onChange: this.inputChange}),
					e('button', null, "Submit"))
			);
		}
	}
}

const socket = io();

socket.on("message", (msg) => appendMessage(msg));

ReactDOM.render(e(chat), document.getElementById('chat'));