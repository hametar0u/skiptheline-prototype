import React, { UseState } from 'react';

import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';

import cookie from '../static/COOKIE.png'

import NavHeader from './Nav';

const FoodItems = [
	{item:'Chicken Rice', price:'5.95'},
	{item:'Special', price:'6.95'},
	{item:'Food', price:'6.95'},
	{item:'Cookies', price:'2.95'},
	{item:'Sandwich', price:'6.95'},
];

const DrinkItems = [
	{item:"Dasani Water", price:'1.95'},
	{item:'Fiji water', price:'2.95'}
];

const OrderedItems = [
	{item:'Dasani Water', price:'1.95', quantity:'3', date:'9/23/2020'},
	{item:'Fiji water', price:'2.95', quantity:'2', date:'9/25/2020'},
	{item:'Chicken Rice', price:'5.95', quantity:'3', date:'10/2/2020'},
	{item:'Special', price:'6.95', quantity:'1', date:'10/3/2020'}
];



const Cart = (props) => {

	return props.items.map(item => (
		<React.Fragment>
			<tr>
				<td>{item.quantity}</td>
				<td>{item.item}</td>
				<td>{item.price}</td>
				<td>{item.date}</td>
				<td>
					<Button variant='outline-secondary'>Remove</Button>
				</td>
			</tr>
		</React.Fragment>
	));
}


const ItemCards = (props) => {

	return props.items.map(item => (
		<React.Fragment>
			<Col xs='1' sm='1' md='3' lg='5' xl='5'>
				<Card>
					<Card.Header>
						<h2>{item.item}</h2>
					</Card.Header>
					<Card.Body>
						<Image
							fluid
							src={cookie}
							alt='cookie'
						/>
					</Card.Body>
					<Card.Footer>
						<h3>${item.price}</h3>
						<input type='number'/>
						<Button variant='outline-primary'>Add to Cart</Button>
					</Card.Footer>
				</Card>
			</Col>
		</React.Fragment>
	));
}

const OrderNow = (props) => {

	return(
		<React.Fragment>
			<NavHeader/>

			<Container id='order-container'>
				<Form>
					<Row>
						<Col>
							<Form.Label>What date are you ordering for?</Form.Label>
						</Col>
						<Col>
							<Form.Control  as='select'>
								<option>Monday</option>
								<option>Tuesday</option>
								<option>Wednesday</option>
								<option>Thursday</option>
								<option>Friday</option>
							</Form.Control>
						</Col>
					</Row>
				</Form>

				<Table striped id='tablecart'>
					<thead>
						<tr>
							<th>Quantity</th>
							<th>Item Name</th>
							<th>Price</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						<Cart items={OrderedItems}/>
					</tbody>
				</Table>
			</Container>
			<Container id='menu-container'>
				<h1>Food</h1>
				<Row>
					<ItemCards items={FoodItems}/>
				</Row>

				<h1>Drinks</h1>
				<Row>
					<ItemCards items={DrinkItems}/>
				</Row>
			</Container>
		</React.Fragment>
	);	
}

export default OrderNow;