import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from './pages/home/Home';
import Dashboard from './pages/dashboard/Dashboard';
import './_assets/icons/strokegap/icons.css';
import './_assets/icons/fontawsome/css/all.min.css';
import './_assets/sass/main.scss';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router basename = { process.env.REACT_APP_BASE || '' } >
          <Switch>
            <Route exact path="/home" component={Home} />
            <Route exact path="/" component={Dashboard} />
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App;
