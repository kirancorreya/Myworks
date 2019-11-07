import React from 'react';
import logo from '../../_assets/images/starlifyLogo@2x.png';
import Signin from './Signin';

export default class HomeHeader extends React.Component {

  render() {
    return (
      <div className="col-md-12">
        <div className="d-flex justify-content-between home-nav">
          <div className="">
            <img src={logo} className="img-fluid logo" alt="Starlify" />
          </div>
          <Signin />
        </div>
      </div>
    )
  }
}
