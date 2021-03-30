import React, { useState } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container'

import { Link } from 'react-router-dom';

const Login = () => {
	const [userRequest, setUserRequest] = useState({
		user: null,
		password: null
	});

	const onSubmitForm = async e => {
		e.preventDefault();
		try {
			const body = {userRequest};
			const response = await fetch("http://localhost:5000/selectUser", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(body)
			});
			console.log(response);
		} catch (err) {
			console.err(err.message);
		}
	}

	return(
		<Container>
			<Form onSubmit={onSubmitForm}>
				<h1 style={{textAlign: "center"}}>Log In</h1>

				<h6>Email</h6>
				<Form.Group>
					<Form.Control type="email" onChange={e => setUserRequest({user: e.target.value})}/>
				</Form.Group>

				<h6>Password</h6>
				<Form.Group>
					<Form.Control type="password" onChange={e => setUserRequest({password: e.target.value})}/>
				</Form.Group>

				<Button type="submit" variant="outline-primary">Log In</Button>

				<p>Don't have an account? Sign up 
				<Link to='/signup'> here</Link></p>
			</Form>
		</Container>
	);

}

ReactDOM.render(Login,document.getElementById('Login'));

// const domContainer = document.querySelector('#login_container');
// ReactDOM.render(Login, domContainer);