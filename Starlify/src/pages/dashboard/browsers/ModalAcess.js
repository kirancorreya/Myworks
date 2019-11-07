import React, { Component } from "react";
import { Modal, ModalBody, Col, Row, Collapse } from "reactstrap";
import check from "../../../_assets/icons/icons/check-icon.svg";
import { connect } from "react-redux";
import closeIcon from "../../../_assets/icons/icons/exitwhite.svg";
import VerticalScrollbars from "../../../_assets/Scrollbars/VerticalScrollbars";
class ModalAcess extends Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.fetchDivisions = this.fetchDivisions.bind(this);
    this.fetchTeams = this.fetchTeams.bind(this);
    this.fetchPersons = this.fetchPersons.bind(this);
    this.state = {
      modeluri: "",
      model: null,
      models: [],
      divisions: [],
      grants: [],
      editDivison: null,
      accessEditor: false,
      popup: false,
      eventType: null,
      collapse_div: null,
      collapse_team: null
    };
  }

  close(type) {
    this.props.close(type);
  }

  modalToggle = () => {
    this.setState({
      popup: !this.state.popup,
      eventType: null
    });
  };

  selectModel = e => {
    this.setState({
      modeluri: e.target.value,
      collapse_div: null,
      collapse_team: null
    });
    fetch(process.env.REACT_APP_API + e.target.value)
      .then(res => res.json())
      .then(result => {
        this.setState({
          model: result,
          accessEditor: true
        });
      })
      .catch(error => {
        this.setState({
          model: null,
          accessEditor: false
        });
      });
      var modelArr = e.target.value.split("/");
      this.fetchModelGrants(modelArr[2]);
      this.fetchDivisions(this.props.domain);
  };

  fetchModelGrants = modelId => {
    fetch( process.env.REACT_APP_API + "/hypermedia/domain/" + this.props.domain + "/grant/" + modelId )
      .then(res => res.json())
      .then(json => {
        this.setState({ grants: json });
      });
  };

  fetchDivisions = domainId => {
    return fetch(process.env.REACT_APP_API + "/hypermedia/domain/" + domainId)
      .then(res => res.json())
      .then(result => {

        var org = result.organisation;
        fetch( process.env.REACT_APP_API + "/hypermedia/domain/" + domainId + "/organisation/" + org.id + "/organisations" )
        .then(res => res.json())
        .then(async (json) => {
          var organisations = json;
          for (var i = 0; i < organisations.length; i++) {
            let org = organisations[i];
            org["teams"] = [];
            if (org._links && org._links.length !== 0 && this.state.model !== null) {
              await this.fetchTeams(domainId, this.state.model.id, org.id).then(
                teams => (org["teams"] = teams)
              );
            }
          }
          this.setState({
            divisions: organisations
          });
          return true;
        });

      });
  };

  fetchTeams = (domainId, modelId, orgid) => {
    return fetch( process.env.REACT_APP_API + "/hypermedia/domain/" + domainId + "/organisation/" + orgid + "/organisations" )
      .then(res => res.json())
      .then(json => {
        var organisations = json;
        for (var i = 0; i < organisations.length; i++) {
          let org = organisations[i];
          org["persons"] = [];
          if (org._links && org._links.length !== 0) {
            this.fetchPersons(domainId, modelId, org.id).then(
              persons => (org["persons"] = persons)
            );
          }
        }
        return organisations;
      });
  };

  fetchPersons = (domainId, modelId, orgid) => {
    return fetch( process.env.REACT_APP_API + "/hypermedia/domain/" + domainId + "/organisation/" + orgid + "/persons" )
      .then(res => res.json())
      .then(persons => {
        return persons;
      });
  };

  editAccess = (e) => {
    this.state.divisions.forEach((division)=>{
      if (division.id === e.target.id) {
        this.setState({
          editDivison: division
        })
      }
    })
    this.setState({
      eventType: "access-edit",
      popup: true
    })
  }

  onGrantChange = (e, grantid) => {
    if (e.target.checked) {
      this.addGrantAccess( this.props.domain, this.state.model.id, grantid, e.target.value );
    } else {
      this.deleteGrantAccess( this.props.domain, this.state.model.id, grantid, e.target.value );
    }
  };

  addGrantAccess = (domainId, modelId, grantid, value) => {
    fetch( process.env.REACT_APP_API + "/hypermedia/domain/" + domainId + "/grant/" + modelId + "/" + grantid + "/permission/" + value, { method: "POST" } )
      .then(result => {
        this.fetchModelGrants(this.state.model.id);
      })
      .catch(error => { });
  };

  deleteGrantAccess = (domainId, modelId, grantid, value) => {
    fetch( process.env.REACT_APP_API + "/hypermedia/domain/" + domainId + "/grant/" + modelId + "/" + grantid + "/permission/" + value, { method: "DELETE" } )
      .then(result => {
        this.fetchModelGrants(this.state.model.id);
      })
      .catch(error => { });
  };

  componentDidMount() {
    var domainID = this.props.domain;
    if (domainID !== "") {
      fetch(process.env.REACT_APP_API + "/hypermedia/domain/" + domainID)
        .then(res => res.json())
        .then(result => {
          this.setState({
            models: result.links
          });
        })
        .catch(error => {
          this.setState({ models: [] });
        });
    }
  }

  componentWillReceiveProps(newProps) {
    const { domain, type } = newProps;
    switch (type) {
      case "SELECTDOMAIN":
        this.setState({
          modeluri: "",
          model: null,
          models: [],
          divisions: [],
          grants: [],
          accessEditor: false,
          popup: false,
          eventType: null
        });
        if (domain !== "") {
          fetch(process.env.REACT_APP_API + "/hypermedia/domain/" + domain)
            .then(res => res.json())
            .then(result => {
              this.setState({
                models: result.links
              });
            })
            .catch(error => {
              this.setState({ models: [] });
            });
        }
        break;
      default:
        break;
    }
  }

  collapseDivList = (divisionId) => {
    var {collapse_div} = this.state;
    var collapse = null;
    if (collapse_div === null) {
      collapse = divisionId;
    }else{
      if (divisionId === collapse_div) collapse = null;
      else collapse = divisionId;
    }
    this.setState({
      collapse_div: collapse
    })
  }

  collapseTeamList = (teamId) => {
    var {collapse_team} = this.state;
    var collapse = null;
    if (collapse_team === null) {
      collapse = teamId;
    }else{
      if (teamId === collapse_team) collapse = null;
      else collapse = teamId;
    }
    this.setState({
      collapse_team: collapse
    })
  }

  render() {
    const models = this.state.models;
    var editDivison = this.state.editDivison;
    var stripes = true;
    if (this.state.editDivison !== null) {
      var eDRead = false;
      var eDWrite = false;
      this.state.grants.forEach((item) => {
        if (item.principal.id === this.state.editDivison.id) {
          eDRead = item.permissions.includes( "RESOURCE_READ" ) ? true : false;
          eDWrite = item.permissions.includes( "RESOURCE_ANY" ) ? true : false;
        }
      });
    }
    return (
      <div className="browser">
        <Modal isOpen={this.state.popup} toggle={this.modalToggle} className="selectModal" >
          <ModalBody>
            {this.state.eventType === "model-choose" && (
              <div>
                  <h3 className="d-inline-block modal-title">Choose model</h3>
                  <button className="btn grey-btn modal-top-btn" onClick={this.modalToggle}> Done <img src={check} alt="" /> </button>
                  <p className="text-white text-size-16 m-t-10">
                    Choose which model you want to edit
                  </p>
                  <div className="model-list m-t-35">
                    <ul>
                      {models && models.map((item, i) => (
                        <li  key={"models_" + i} className="d-flex">
                          <Col md="8" className="modelName"> {item.title} </Col>
                          <Col md="4">
                            <input type="radio" id={"mod_opt"+i} name="modelUri" value={item.uri} checked={this.state.modeluri === item.uri} onChange={this.selectModel} />
                            <label htmlFor={"mod_opt"+i}></label>
                            <div className="check"></div>
                          </Col>
                        </li>
                      ))}
                    </ul>
                  </div>
              </div>
            )}
            {this.state.eventType === "access-edit" &&(
              <div>
                  <h3 className="d-inline-block modal-title"> Edit access for {editDivison.name} </h3>
                  <button className="btn grey-btn modal-top-btn" onClick={this.modalToggle}> Done <img src={check} alt="" /> </button>
                  <div className="modalAccesListing">
                    <div className="browser_body">
                      <div className="division_model">
                        <div className="browser_body_content">
                          <div>
                            <ul className="modelListWrapper m-t-35">
                              <li className="modelListHeader text-white">
                                <Row>
                                  <Col sm="6"></Col>
                                  <Col sm="2" className="text-center"> Read </Col>
                                  <Col sm="2" className="text-center"> Write </Col>
                                  <Col sm="2"></Col>
                                </Row>
                              </li>
                              <li className="modelListbody text-white divisionListItem no_bg">
                                <div className={`d-flex ${stripes ? 'linestripe':''}`}>
                                  <Col sm="6" className="divisionitemtext listpadding">
                                  {editDivison.teams.length !== 0 &&(
                                    <i className="fas fa-chevron-down "></i>
                                  )}
                                  {editDivison.name}
                                  </Col>
                                  <Col sm="2" className="text-center listpadding">
                                    <input type="checkbox" className="regular-checkbox" checked={eDRead ? "checked" : ""} id={"read_" + editDivison.id} defaultValue="RESOURCE_READ" onChange={e => { this.onGrantChange(e, editDivison.id); }}/>
                                    <label htmlFor={"read_" + editDivison.id}></label>
                                  </Col>
                                  <Col sm="2" className="text-center listpadding">
                                    <input type="checkbox" className="regular-checkbox" checked={eDWrite ? "checked" : ""} id={"write_" + editDivison.id} defaultValue="RESOURCE_ANY" onChange={e => { this.onGrantChange(e, editDivison.id); }} />
                                    <label htmlFor={"write_" + editDivison.id}></label>
                                  </Col>
                                  <Col sm="2"></Col>
                                </div>

                                <ul className="teamListWrapper">
                                  {
                                    editDivison.teams.map((team, i) => {
                                      var tmRead = false;
                                      var tmWrite = false;
                                      stripes = (stripes)? false: true;
                                      this.state.grants.forEach((item) => {
                                        if (item.principal.id === team.id) {
                                          tmRead = item.permissions.includes( "RESOURCE_READ" ) ? true : false;
                                          tmWrite = item.permissions.includes( "RESOURCE_ANY" ) ? true : false;
                                        }
                                      });
                                      return (
                                        <li key={"tm_key"+i} className="teamListItem">
                                          <div className={`d-flex ${stripes ? 'linestripe':''}`}>
                                            <Col sm="6" className="teamitemtext listpadding">
                                            {team.persons.length !== 0 &&(
                                              <i className="fas fa-chevron-down "></i>
                                            )}
                                            {team.name}
                                            </Col>
                                            <Col sm="2" className="text-center listpadding">
                                              <input type="checkbox" className="regular-checkbox" checked={tmRead ? "checked" : ""} id={"read_" + team.id} defaultValue="RESOURCE_READ" onChange={e => { this.onGrantChange(e, team.id); }}/>
                                              <label htmlFor={"read_" + team.id}></label>
                                            </Col>
                                            <Col sm="2" className="text-center listpadding">
                                              <input type="checkbox" className="regular-checkbox" checked={tmWrite ? "checked" : ""} id={"write_" + team.id} defaultValue="RESOURCE_ANY" onChange={e => { this.onGrantChange(e, team.id); }} />
                                              <label htmlFor={"write_" + team.id}></label>
                                            </Col>
                                            <Col sm="2"></Col>
                                          </div>
                                          <ul className="developerListWrapper">
                                            {
                                              team.persons.map((person, i) => {
                                                var prRead = false;
                                                var prWrite = false;
                                                stripes = (stripes)? false: true;
                                                this.state.grants.forEach((item) => {
                                                  if (item.principal.id === person.id) {
                                                    prRead = item.permissions.includes( "RESOURCE_READ" ) ? true : false;
                                                    prWrite = item.permissions.includes( "RESOURCE_ANY" ) ? true : false;
                                                  }
                                                });
                                                return (
                                                  <li key={"pr_key"+i} className="developerListItem">
                                                    <div className={`d-flex ${stripes ? 'linestripe':''}`}>
                                                      <Col sm="6" className="developeritemtext listpadding"> {person.name} </Col>
                                                      <Col sm="2" className="text-center listpadding">
                                                        <input type="checkbox" className="regular-checkbox" checked={prRead ? "checked" : ""} id={"read_" + person.id} defaultValue="RESOURCE_READ" onChange={e => { this.onGrantChange(e, person.id); }}/>
                                                        <label htmlFor={"read_" + person.id}></label>
                                                      </Col>
                                                      <Col sm="2" className="text-center listpadding">
                                                        <input type="checkbox" className="regular-checkbox" checked={prWrite ? "checked" : ""} id={"write_" + person.id} defaultValue="RESOURCE_ANY" onChange={e => { this.onGrantChange(e, person.id); }}/>
                                                        <label htmlFor={"write_" + person.id}></label>
                                                      </Col>
                                                      <Col sm="2"></Col>
                                                    </div>
                                                  </li>
                                                )
                                              })
                                            }
                                          </ul>
                                        </li>
                                      )
                                    })
                                  }
                                </ul>

                              </li>

                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            )}

          </ModalBody>
        </Modal>
        {this.state.accessEditor === false && (
          <div className="modalAccesListing">
            <div className="browser_header text-white">
              <div>
                <i className="fas fa-key submenu-icon"></i>
                <h3 className="d-inline-block">Model Access</h3>
                <img
            src={closeIcon}
            alt="starlify"
            className="system-down-icon submenu-icon"
            onClick={() => this.close("modelAccess")}
          />
              </div>
              <div className="text-right modelChooseWrapper">
                <button href={null} className="modelChoose raleway" onClick={() => { this.setState({ eventType: "model-choose", popup: true }); }} > Choose model </button>
              </div>
            </div>
            <div className="browser_body emptyBody">
              <p className="text-center text-white m-t-45 text-size-18">
                So you need to give access to your division, teams or
                developers?
                <br />
                You’ve come to the right place.
              </p>
              <p className="text-center text-white m-t-40 text-size-18">
                Just click the <strong>Choose model</strong> button and choose what <br />
                model you need to work in and then you can start adding <br />
                your division, teams and developers.
              </p>
              <h1 className="text-center text-grey m-t-85">No chosen model</h1>
            </div>
          </div>
        )}

        {this.state.accessEditor === true && (
          <div className="modalAccesListing">
            <div className="browser_header text-white">
              <div>
                <i className="fas fa-key submenu-icon"></i>
                <h3 className="d-inline-block">Model Access</h3>
                <img
            src={closeIcon}
            alt="starlify"
            className="system-down-icon submenu-icon"
            onClick={() => this.close("modelAccess")}
          />
              </div>
              <p>
                Edit models access for <span>{this.state.model.name}</span>
              </p>
              <div className="text-right modelChooseWrapper">
                <button className="d-inline-block modelChoose" onClick={() => { this.setState({ eventType: "model-choose", popup: true }); }} > Change model </button>
              </div>
            </div>
            <div className="browser_body">
              <div className="division_model">
                <div className="browser_body_header text-white">
                  <h4 className="d-inline-block">Divisions</h4>
                </div>
                <div className="browser_body_content">
                  <div>
                 
                    <ul className="modelListWrapper">
                      <li className="modelListHeader text-white">
                        <Row>
                          <Col sm="5"></Col>
                          <Col sm="3" className="text-center"> Read </Col>
                          <Col sm="3" className="text-center"> Write </Col>
                          <Col sm="1"></Col>
                        </Row>
                      </li>
                      <VerticalScrollbars
              style={{ height: "calc(100vh - 260px)" }}
              autoHide
            >
                      {this.state.divisions && this.state.divisions.length !== 0 && this.state.divisions.map((division, i) => {
                          var divRead = false;
                          var divWrite = false;
                          this.state.grants.forEach((item) => {
                            if (item.principal.id === division.id) {
                              divRead = item.permissions.includes( "RESOURCE_READ" ) ? true : false;
                              divWrite = item.permissions.includes( "RESOURCE_ANY" ) ? true : false;
                            }
                          });
                          return (
                            <li key={"dv_key"+i} className="modelListbody text-white divisionListItem" >
                              <Row onClick={() => this.collapseDivList(division.id)}>
                                <Col sm="5" className="divisionitemtext listpadding">
                                  {division.teams.length !== 0 &&(
                                    <i className={`fas fa-chevron-${this.state.collapse_div === division.id ? 'down' : 'right'}`}></i>
                                  )}
                                  {division.name}
                                </Col>
                                <Col sm="3" className="text-center listpadding">
                                  
                                  <span className={divRead ? "permisionGrant" : "permisionDenied"}></span>
                                </Col>
                                <Col sm="3" className="text-center listpadding">
                                  <span className={divWrite ? "permisionGrant" : "permisionDenied"}></span>
                                </Col>
                                <Col sm="1" className="listpadding p-l-0"> <i id={division.id} className="fas fa-pen" onClick={this.editAccess}></i> </Col>
                              </Row>

                              <Collapse isOpen={this.state.collapse_div === division.id ? true : false}>
                                <ul className="teamListWrapper">
                                  {
                                    division.teams.map((team, i) => {
                                      var tmRead = false;
                                      var tmWrite = false;
                                      this.state.grants.forEach((item) => {
                                        if (item.principal.id === team.id) {
                                          tmRead = item.permissions.includes( "RESOURCE_READ" ) ? true : false;
                                          tmWrite = item.permissions.includes( "RESOURCE_ANY" ) ? true : false;
                                        }
                                      });
                                      return (
                                        <li key={"tm_key"+i} className="teamListItem">
                                          <Row onClick={() => this.collapseTeamList(team.id)}>
                                            <Col sm="5" className="teamitemtext listpadding">
                                              {team.persons.length !== 0 &&(
                                                <i className={`fas fa-chevron-${this.state.collapse_team === team.id ? 'down' : 'right'}`}></i>
                                              )}
                                              {team.name}
                                            </Col>
                                            <Col sm="3" className="text-center listpadding">
                                              <span className={tmRead ? "permisionGrant" : "permisionDenied"}></span>
                                            </Col>
                                            <Col sm="3" className="text-center listpadding">
                                              <span className={tmWrite ? "permisionGrant" : "permisionDenied"}></span>
                                            </Col>
                                          </Row>
                                          <Collapse isOpen={this.state.collapse_team === team.id ? true : false}>
                                            <ul className="developerListWrapper">
                                              {
                                                team.persons.map((person, i) => {
                                                  var prRead = false;
                                                  var prWrite = false;
                                                  this.state.grants.forEach((item) => {
                                                    if (item.principal.id === person.id) {
                                                      prRead = item.permissions.includes( "RESOURCE_READ" ) ? true : false;
                                                      prWrite = item.permissions.includes( "RESOURCE_ANY" ) ? true : false;
                                                    }
                                                  });
                                                  return (
                                                    <li key={"pr_key"+i} className="developerListItem">
                                                      <Row>
                                                        <Col sm="5" className="developeritemtext listpadding"> {person.name} </Col>
                                                        <Col sm="3" className="text-center listpadding">
              
                                                          <span className={prRead ? "permisionGrant" : "permisionDenied"}></span>
                                                        </Col>
                                                        <Col sm="3" className="text-center listpadding">
                            
                                                          <span className={prWrite ? "permisionGrant" : "permisionDenied"}></span>
                                                        </Col>
                                                      </Row>
                                                    </li>
                                                  )
                                                })
                                              }
                                            </ul>
                                          </Collapse>

                                        </li>
                                      )
                                    })
                                  }
                                </ul>
                              </Collapse>

                            </li>
                          );
                        })}
</VerticalScrollbars>
                      </ul>
                      
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    domain: state.model.domain,
    type: state.model.type
  };
}

export default connect(mapStateToProps)(ModalAcess);
