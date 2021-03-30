import React from 'react';

import Login from "./components/Login";
import Signup from "./components/Signup";
import NavHeader from "./components/Nav";

import OrderNow from './components/OrderNow';
import PendingOrders from './components/PendingOrders';
import OrderHistory from './components/OrderHistory';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Switch, Route } from 'react-router-dom';

import './App.css';

import Container from 'react-bootstrap/Container';

const App = () => {
  return (
  	<Container fluid>
   		<Switch>
			<Route exact path='/' component={Login}/>
  			<Route exact path='/login' component={Login}/>
  			<Route exact path='/signup' component={Signup}/>
			<Route exact path='/app/OrderNow' component={OrderNow}/>
			<Route exact path='/app/PendingOrders' component={PendingOrders}/>
			<Route exact path='/app/OrderHistory' component={OrderHistory}/>
  		</Switch>
  	</Container>
  );

}

export default App;
