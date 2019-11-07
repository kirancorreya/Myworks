import React, { Component } from 'react';
import Graph from './graph/Graph';
import Header from '../../_partials/Header/Header';
import RightButtons from '../../_partials/RightButtons';

class Dashboard extends Component {

  render() {
    return (
      <div className="dashboard">
        <RightButtons />
        <Header />
        <Graph /> 
      </div>
    )
  }
}

export default Dashboard;