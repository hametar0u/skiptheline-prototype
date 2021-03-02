import React, { UseState } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';

import { Link } from 'react-router-dom';

const Signup = (props) => {

	return(
		<Container>
			<Form>
				<h1>Join Today</h1>

				<h6>First Name</h6>
				<Form.Group>
					<Form.Control type="text"/>
				</Form.Group>

				<h6>Last Name</h6>
				<Form.Group>
					<Form.Control type="text"/>
				</Form.Group>

				<h6>Student Email</h6>
				<Form.Group>
					<Form.Control type="email" placeholder="studentnumber@learn.vsb.bc.ca"/>
				</Form.Group>

				<h6>Password</h6>
				<Form.Group>
					<Form.Control type="password"/>
				</Form.Group>

				<h6>Confirm Password</h6>
				<Form.Group>
					<Form.Control type="password"/>
				</Form.Group>

				<Button variant="outline-primary">Sign Up</Button>
				<p>Already have an account? Log in 
				<Link to='/login'> here </Link></p>
			</Form>
		</Container>
	);

}

export default Signup;