import React from 'react';
import google from '../../_assets/images/google.png';
export default class Signin extends React.Component {
  constructor(){
    super();
    this.googleLogin = this.googleLogin.bind(this)
    this.state = {
      popup: false,
    }
  }

  googleLogin = () => {
    window.location.href = "/starlify/authenticator";
  }

  render() {
    return (

      <div  className="signWrapper" ref={ node => { this.node = node }}>
        <div onClick={ ()=>{ this.setState(state => ({ popup: !state.popup })) } } className="signin">
          Sign In
        </div>
        {this.state.popup && (
          <div className="signincontent">
            <h3 className="text-center">Sign Up</h3>
            <form method="post" autoComplete="off">
              <input className="col-md-12" type="text" name="emailid" placeholder="EMAIL" disabled  />
              <input className="col-md-12" type="password" name="password" placeholder="PASSWORD" disabled />
              <input className="col-md-12" type="password" name="passwordconfirm" placeholder="CONFIRM PASSWORD" disabled />
              <button type="submit" className="btn transparent-btn col-md-12" disabled>SIGN IN</button>
            </form>
            <div className="formSeperate">OR SIGN IN WITH</div>
            <button onClick={this.googleLogin} className="btn red-btn col-md-12"><img src={google} className="img-fluid logo" alt="" /></button>
          </div>
        )}
      </div>
    )
  }
}
