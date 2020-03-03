import React from 'react';
import Product from './component/Product';
import { Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './component/Home';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/products" component={Product} />
      </Switch>
    </div>
  );
}

export default App;
