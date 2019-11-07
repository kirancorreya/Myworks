import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Row, Col } from 'reactstrap';
import desktopTop from '../../_assets/images/Visualization.svg';
import logo from '../../_assets/images/starlifyLogo@2x.png';

export default class Body extends React.Component {

  constructor() {
		super();
		this.state = {
			shown: true,
		};
	}

	toggle() {
		this.setState({
			shown: !this.state.shown
		});
	}

	render() {
		var shown = {
			display: this.state.shown ? "block" : "none"
		};
		
		var hidden = {
			display: this.state.shown ? "none" : "block"
		}

    return (
      <div className="content-container">  
        <img src={logo} className="img-fluid logo" alt="Starlify" />
        <div className="home-main-container" id="tryitout">    
          <div className="home-main d-flex col-md-4 align-items-center">
            <div className="banner-content">
              <h3 className="text-white">WELCOME TO</h3>
              <h1>STARLIFY</h1>
              <p className="text-white">Become the brightest shining star of your API
                landscape and bring warp speed to your developer
                community! This is Starlify; A tool to enable your
                developer community to connect through open application
                network graphing. Starlify provide unprecedented visibility
                and actionable insights accelerating the digital transformation
                of your business.</p>
              <h5 className="text-white">Launch 21 October</h5>
              <div className="banner-button">
                <a className="greenGradiant-btn" href="#test">Sign up for BETA</a>
                <div className="bordergreenGradiant-btn-wrapper"><a className="bordergreenGradiant-btn" href="#readmore">Read more</a></div>  
              </div>
            </div>
          </div>
          <div className="home-desktop-top col-md-8 justify-content-end">
            <img src={desktopTop} className="img-fluid desktopTop" alt="Starlify" />
          </div>
          <div className="banner-down-wrapper">
            <div className="banner-down"><i class="fas fa-chevron-down"></i></div>
          </div>
        </div>
        <div className="home-main-container1" id="readmore">
          <div className="text-block">
            <h4>Get control over your integration landscape</h4>
            <p>Your integration landscape is a mess, it is brave of you to admit it.
              As we both know the first step of solving any problem is recognizing there is one. </p>
          </div>
        </div>
        <div className="home-main-container2" id="readmore">
          <div className="text-block">
            <h4>Manage flows and APIs through all of your applications and teams</h4>
            <p>The days if static, boring lists that cause nothing but stress-related
              hairloss are over. Introduce a bit of overview by using Starlify to keep
              track of all your applications and APIs, who is creating them and for what area of usage. </p>
          </div>
        </div>
        <div className="home-main-container3" id="readmore">
          <div className="image-block">
          </div>
          <div className="text-block">
            <h4>Keep track of your organisation to set clear directives</h4>
            <p>Make sure all of your organisation is headed in the desired direction. A chicken farm of confused
              teams makes no productive use in the long term. Set them free with a collective vision and a tool to keep track of it. </p>
          </div>
        </div>
        <div className="home-main-container4" id="readmore">
          <div className="text-block">
            <h4>Get started with Starlify!</h4>
            <a className="greenGradiant-btn" href="#test">Sign up for BETA</a>
          </div>
        </div>
        <div className="home-main-container5" id="readmore">
          <div className="text-block">
            <h4>Get the news before anyone else</h4>
            <Form>
              <Row>
                <Col>
                  <FormGroup>
                    <Input type="text"  id="firstname" placeholder="First Name" />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Input type="text"  id="lastname" placeholder="Last Name" />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Input type="email"  id="email" placeholder="Email" />
              </FormGroup>
              <FormGroup>
                <Input type="text"  id="company" placeholder="Company Name" />
              </FormGroup>

              <Button className="white-btn-home"><span>Sign me up!</span></Button>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}
