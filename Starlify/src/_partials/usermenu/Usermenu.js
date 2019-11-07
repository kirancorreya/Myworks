import React, { Component } from "react";
import { FormGroup, Input, TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from "reactstrap";
import photo from "../../_assets/images/photo.jpg";
import { connect } from "react-redux";
import { fetchModel } from "../../store/model/modelActions";
import { fetchFlows } from "../../store/system/systemActions";
import classnames from 'classnames';

class Usermenu extends Component {
  constructor() {
    super();
    this.fetchModels = this.fetchModels.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      domains: [],
      models: [],
      activeTab: '1'
    };
  }
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  componentDidMount() {
    fetch(process.env.REACT_APP_API + "/hypermedia/domains")
      .then(res => res.json())
      .then(result => {
        this.setState({ domains: result });
      });
    if (this.props.domain !== "") {
      this.fetchModels(this.props.domain);
    }
  }

  domainChange = e => {
    this.props.onDomainSelect(e);
    if (e.target.value !== "") {
      this.fetchModels(e.target.value);
    } else {
      this.setState({ models: [] });
    }
  };

  fetchModels = domainID => {
    fetch(process.env.REACT_APP_API + "/hypermedia/domain/" + domainID)
      .then(res => res.json())
      .then(async domain => {
        this.setState({ models: domain.links });
      });
  };

  render() {
    const domains = this.state.domains;
    const models = this.state.models;
    return (
      <div className="usermenu">
        <Row className="usermenuHeader">
          <Col md="7" className="text-white">Your Profile</Col>
          <Col md="5">
            <ul className="profileSwitch">
              <li  className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}> <i className="fas fa-user text-white"></i></li>
              <li className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}> <i className="fas fa-bell text-white"></i></li>
            </ul>
          </Col>
        </Row>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
          <ul>
          <li className="userarea">
            <img src={photo} alt="starlify" className="photo-icon" />{" "}
            <span className="name text-white">Name Surname</span>
          </li>
              <ul>
              <li className="text-grey no-border">
              <i className="fas fa-cog submenu-icon" />
              Settings
            </li>
            <li className="text-grey no-border m-t-15">
            <i className="fas fa-newspaper submenu-icon" />
              News
            </li>
            <li className="text-grey no-border">
            <i className="fas fa-question-circle submenu-icon" />
              Help
            </li>
            
            <li className="text-grey no-border">
            <i className="fas fa-sign-out-alt submenu-icon"/>
              Sign out
            </li>
          </ul>
        </ul>
          </TabPane>
          <TabPane tabId="2" className="notificationWrapper">
            <p className="newsCatHead">New</p>
            <ul>
              <li>Albert Einsten has invited you to join Team 3</li>
              <li>Aretha Franklin has invited you to join Team 7</li>
            </ul>
            <p className="newsCatHead old">Older</p>
            <ul className="olderNews">
              <li>Albert Einsten has invited you to join Team 3</li>
              <li>Aretha Franklin has invited you to join Team 7</li>
            </ul>
          </TabPane>
        </TabContent>
        
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    domain: state.model.domain,
    model: state.model.modelUri
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDomainSelect: e => {
      const action = { type: "SELECTDOMAIN", domain: e.target.value };
      dispatch(action);
    },

    onModelSelect: e => {
      const selectedIndex = e.target.options.selectedIndex;
      const modelId = e.target.options[selectedIndex].getAttribute("data-key");
      const action = {
        type: "SELECTMODEL",
        model: e.target.value,
        modelId: modelId
      };
      dispatch(fetchModel(modelId));
      dispatch(fetchFlows(modelId));
      dispatch(action);
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Usermenu);
