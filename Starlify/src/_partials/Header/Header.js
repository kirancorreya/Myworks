import React, { Component } from "react";
import { FormGroup, Input } from "reactstrap";
import photo from "../../_assets/images/photo.jpg";
import Organisation from "../../pages/dashboard/browsers/Organisation";
import Systems from "../../pages/dashboard/browsers/Systems";
//import Tagger from "../../pages/dashboard/browsers/Tagger";
import OrganisationDetails from "../../pages/dashboard/browsers/OrganisationDetails";
import SystemDetails from "../../pages/dashboard/browsers/SystemDetails";
import FlowDetails from "../../pages/dashboard/browsers/FlowDetails";
import Mathew from "../../pages/dashboard/browsers/mathew";
import Usermenu from "../usermenu/Usermenu";
import ModalAcess from "../../pages/dashboard/browsers/ModalAcess";
import logo from "../../_assets/images/Logo-starlify.png";
import { fetchModel } from "../../store/model/modelActions";
import { fetchFlows } from "../../store/system/systemActions";
import { connect } from "react-redux";

class Header extends Component {
  constructor(props) {
    super(props);
    this.fetchModels = this.fetchModels.bind(this);
    this.state = {
      domains: [],
      models: [],
      systemShow: false,
      systemDetailsVisible: false,
      userVisible: false,
      systemId: "",
      flowId: "",
      toggle: {
        organisation: false,
        orgDetail: false,
        modelAccess: false
      }
    };

    this.menuClick = this.menuClick.bind(this);
    this.userhandleClick = this.userhandleClick.bind(this);
    this.systemSelected = this.systemSelected.bind(this);
    this.close = this.close.bind(this);
  }

  menuClick(menu) {
    if (menu === "system") {
      this.setState(prev => ({
        systemId: "",
        flowId: "",
        systemShow: !prev.systemShow,
        systemDetailsVisible: false,
        flowDetailsVisible: false,
        toggle: {
          organisation: false,
          orgDetail: false,
          modelAccess: false
        }
      }));
    } else if (menu === "organisation") {
      this.setState(prev => ({
        systemShow: false,
        systemDetailsVisible: false,
        flowDetailsVisible: false,
        toggle: {
          organisation: !prev.toggle.organisation,
          orgDetail: prev.toggle.orgDetail,
          modelAccess: false
        }
      }));
    } else if (menu === "orgDetail") {
      this.setState(prev => ({
        systemShow: false,
        systemDetailsVisible: false,
        flowDetailsVisible: false,
        toggle: {
          organisation: prev.toggle.organisation,
          orgDetail: !prev.toggle.orgDetail,
          modelAccess: false
        }
      }));
    } else if (menu === "modelAccess") {
      this.setState(prev => ({
        systemShow: false,
        systemDetailsVisible: false,
        flowDetailsVisible: false,
        toggle: {
          organisation: false,
          orgDetail: false,
          modelAccess: !prev.toggle.modelAccess
        }
      }));
    } else if (menu === "systemDetail") {
      this.setState({'systemDetailsVisible' : true });
      this.setState(prev => ({
        flowDetailsVisible: false,
        toggle: {
          organisation: false,
          orgDetail: false,
          modelAccess: false
        }
      }));
    } else if (menu === "flowDetail") {
      this.setState({'flowDetailsVisible' : true });
      this.setState(prev => ({
        systemDetailsVisible: false,
        toggle: {
          organisation: false,
          orgDetail: false,
          modelAccess: false
        }
      }));
    }
  }

  close(menu) {
    if (menu === "system") {
      this.setState(prev => ({
        systemShow: !prev.systemShow
      }));
    } else if (menu === "organisation") {
      this.setState(prev => ({
        toggle: {
          ...prev.toggle,
          organisation: !prev.toggle.organisation
        }
      }));
    } else if (menu === "orgDetail") {
      this.setState(prev => ({
        toggle: {
          ...prev.toggle,
          orgDetail: !prev.toggle.orgDetail
        }
      }));
    } else if (menu === "systemDetail") {
      this.setState({'systemDetailsVisible' : false });
    } else if (menu === "flowDetail") {
      this.setState({'flowDetailsVisible' : false });
    } else if (menu === "modelAccess") {
      this.setState(prev => ({
        toggle: {
          ...prev.toggle,
          modelAccess: !prev.toggle.modelAccess
        }
      }));
    }
  }
  systemSelected(systemId) {
    this.setState({
      systemId: systemId,
      flowDetailsVisible: false
    });
  }
  flowsSelected(flowId, status) {
    this.setState({
      flowId: flowId,
      systemDetailsVisible: false,
      flowDetailsVisible: status
    });
  }

  userhandleClick() {
    this.setState(prev => ({
      userDetailsVisible: !prev.userDetailsVisible
    }));
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
      <div className="dashboard_wrapper">
        <div className="dashboard-header">
          <ul className="text-white menu-wrapper">
            <li>
              <ul className="first-menu">
                <li>
                  {" "}
                  <img src={logo} className="dashLogo" alt="" />{" "}
                </li>
                <li
                  className={
                    this.state.toggle.organisation === true ? "active" : ""
                  }
                >
                  <button onClick={() => this.menuClick("organisation")}>
                    <span className="icon icon-Users menu-icon" />
                  </button>
                </li>
                <li
                  className={
                    this.state.toggle.orgDetail === true ? "active" : ""
                  }
                >
                  <button onClick={() => this.menuClick("orgDetail")}>
                    <span className="icon icon-User menu-icon" />
                  </button>
                </li>
                <li className={this.state.systemShow ? "active" : ""}>
                  <button onClick={() => this.menuClick("system")}>
                    <span className="icon icon-EmptyBox menu-icon" />
                  </button>
                </li>
               
               
                {this.props.domain !== "" && (
                  <li className={this.state.toggle.modelAccess ? "active" : ""}>
                    <button onClick={() => this.menuClick("modelAccess")}>
                      <i className="fas fa-key  menu-icon"></i>
                    </button>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </div>
        <div className="content">
          {this.state.toggle.organisation && (
            <div className="organisationVisible orgBrowser browser-item">
              <Organisation close={this.close} />
            </div>
          )}
          {this.state.toggle.orgDetail && (
            <div className="organisationdetailsVisible browser-item">
              <OrganisationDetails close={this.close} />
            </div>
          )}
          {this.state.systemShow && (
            <div className="systemVisible browser-item">
              <Systems
                menuClick={this.menuClick}
                close={this.close}
              />
            </div>
          )}
           
           {this.state.systemDetailsVisible &&  (
            <div className="systemDetailsVisible browser-item">
              <SystemDetails
                systemId={this.state.systemId}
                close={this.close}
              />
            </div>
          )}
         
          {this.state.flowDetailsVisible &&  (
            <div className="flowDetailsVisible flowBrowser browser-item">
              <FlowDetails close={this.close} />
            </div>
          )}

          {this.state.toggle.modelAccess && (
            <div className="systemVisible modal-access browser-item">
              <ModalAcess close={this.close} />
            </div>
          )}
        </div>
        <div className="user_menu_wrapper">
          <ul className="fourth-menu">
          
            <li className="usermenuclick user-avatar">
              <span onClick={this.userhandleClick}>
                Entiros <i className="fas fa-chevron-down m-l-5 m-r-30" />
                <img src={photo} alt="starlify" className="photo-icon" />
              </span>
              {this.state.userDetailsVisible && (
                <div className="userVisible">
                  <Usermenu />
                </div>
              )}
            </li>
           
          <li style={{paddingTop:18}}>
            <FormGroup>
              <Input
                className="select-css"
                type="select"
                name="model"
                onChange={this.props.onModelSelect}
                value={this.props.model}
              >
                <option value="">Select Model</option>
                {models &&
                  models.length !== 0 &&
                  models.map(item => (
                    <option
                      data-key={item.params.id}
                      key={item.uri}
                      value={item.uri}
                    >
                      {item.title}
                    </option>
                  ))}
              </Input>
            </FormGroup>
            </li>
            <li style={{paddingTop:18}}>
            <FormGroup>
              <Input
                className="select-css"
                type="select"
                name="domain"
                onChange={this.domainChange.bind(this)}
                value={this.props.domain}
              >
                <option value="">Select Domain</option>
                {domains.length !== 0 &&
                  domains.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </Input>
            </FormGroup>
          </li>
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    domain: state.model.domain,
    activeSystem: state.model.activeSystem,
    activeFlow: state.system.activeFlow,
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
)(Header);
