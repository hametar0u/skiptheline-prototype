import React, { UseState } from 'react';

import Table from 'react-bootstrap/Table';

const OrderList = props => {
	return props.items.map(item => (
		<React.Fragment>
			<tr>
				<td>{item.quantity}</td>
				<td>{item.item}</td>
				<td>{item.price}</td>
			</tr>
		</React.Fragment>
	));
}

const OrderTable = (props) => {
	return(
		<React.Fragment>
			<Table striped id='tablecart'>
				<thead>
					<tr>
						<th>Quantity</th>
						<th>Item Name</th>
						<th>Price</th>
					</tr>
				</thead>
				<tbody>
					<OrderList items={props.orderItems}/>
				</tbody>
				<tfoot>
					<tr>
						<td>Total:</td>
						<td/>
						<td>{props.orderItems.totalCost}</td>
					</tr>
				</tfoot>
			</Table>
		</React.Fragment>
	);
}

export default OrderTable;