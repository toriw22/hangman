import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Game from './game';
import './styles/App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Game} />
        </Switch>
      </Router>
    );
  }
}

export default App;
