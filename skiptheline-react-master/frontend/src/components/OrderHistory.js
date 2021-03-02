import React, { UseState } from 'react';

import NavHeader from './Nav';
import OrderTable from './OrderList'

const OrderHIstoryArray = [
	{date:'01/03/21',
	 orderID:'abc123',
	 totalCost: '10.00',
	 orderedItems: [
		{item:'Dasani Water', price:'1.95', quantity:'3'},
		{item:'Fiji water', price:'2.95', quantity:'2'},
		{item:'Chicken Rice', price:'5.95', quantity:'3'},
		{item:'Special', price:'6.95', quantity:'1'},
	]},
	{date:'01/04/21',
	 orderID:'273489',
	 totalCost: '23.00',
	 orderedItems: [
		{item:'Dasani Water', price:'1.95', quantity:'92'},
		{item:'Chicken Rice', price:'5.95', quantity:'3'},
		{item:'Special', price:'6.95', quantity:'1'},
	]}
];

const SingleOrder = (props) => {
	return props.items.map(item => (
		<React.Fragment>
			<p>Order date: {item.date}</p>
			<p>Order ID: {item.orderID}</p>
			<p>Order Summary:</p>
			<OrderTable orderItems={item.orderedItems}/>
		</React.Fragment>
	));
}

const OrderHistory = (props) => {

	return(
		<React.Fragment>
			<NavHeader/>
			<SingleOrder items={OrderHIstoryArray}/>
		</React.Fragment>
	);	
}

export default OrderHistory;