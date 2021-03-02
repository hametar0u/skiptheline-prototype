import React, { UseState } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container'

import { Link } from 'react-router-dom';

const Login = (props) => {

	return(
		<Container>
			<Form>
				<h1 style={{textAlign: "center"}}>Log In</h1>

				<h6>Email</h6>
				<Form.Group>
					<Form.Control type="email"/>
				</Form.Group>

				<h6>Password</h6>
				<Form.Group>
					<Form.Control type="password"/>
				</Form.Group>

				<Button variant="outline-primary">Log In</Button>

				<p>Don't have an account? Sign up 
				<Link to='/signup'> here</Link></p>
			</Form>
		</Container>
	);

}

export default Login;
