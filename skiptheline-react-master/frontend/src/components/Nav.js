import React, { UseState } from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

import logo from '../static/logo.png';

import { Link } from 'react-router-dom';

const NavHeader = (props) => {

	return(
		<React.Fragment>
			<Navbar bg='dark' variant='dark' className='container-fluid'>
				<Navbar.Brand className='navbrand'>
					<img
						src={logo}
						width='50'
						height='25'
						className='d-inline-block align-center'
						alt='logo'
					/>
				</Navbar.Brand>
				<Nav variant="pills">
					<Nav.Link href='/app/OrderNow'>Order Now</Nav.Link>
					<Nav.Link href='/app/PendingOrders'>Pending Orders</Nav.Link>
					<Nav.Link href='/app/OrderHistory'>Order History</Nav.Link>
				</Nav>
				<Button variant='outline-light' className='ml-auto'>Log Out</Button>
			</Navbar>
		</React.Fragment>
	);

}

export default NavHeader;