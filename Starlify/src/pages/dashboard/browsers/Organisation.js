import React, { Component } from "react";
import {
  Modal,
  ModalBody,
  Input,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Collapse
} from "reactstrap";
import { connect } from "react-redux";
import { fetchDivisions } from "../../../store/organisation/orgActions";
import addCircle from "../../../_assets/icons/icons/add-icon-circle.svg";

import AddDivision from "../../../_components/organisation/AddDivision";
import EditDivision from "../../../_components/organisation/EditDivision";
import DeleteDivision from "../../../_components/organisation/DeleteDivision";

import AddTeam from "../../../_components/organisation/AddTeam";
import EditTeam from "../../../_components/organisation/EditTeam";
import DeleteTeam from "../../../_components/organisation/DeleteTeam";
import VerticalScrollbars from "../../../_assets/Scrollbars/VerticalScrollbars";
import closeIcon from "../../../_assets/icons/icons/exitwhite.svg";

class Organisation extends Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.modalToggle = this.modalToggle.bind(this);
    this.state = {
      popup: false,
      eventType: null,
      addDivision: false,
      collapse_div: null,
      collapse_team: null,
      edit: {
        division: null,
        team: null
      }
    };
  }

  // closes the organisation section
  close(menu, type) {
    this.props.close(menu, type);
  }

  componentDidMount() {
    if (this.props.domain !== "") {
      this.props.onfetchDivisions(this.props.domain);
    }
  }

  componentDidUpdate(oldProps) {
    const newProps = this.props;
    if (oldProps.domain !== newProps.domain) {
      this.props.onfetchDivisions(newProps.domain);
    }
  }

  editDivisionToggle = division => {
    this.setState(state => {
      let edit = Object.assign({}, state.edit);
      edit.division = division;
      return { edit, eventType: "division-edit", popup: true };
    });
  };

  deleteDivisionToggle = division => {
    this.setState(state => {
      let edit = Object.assign({}, state.edit);
      edit.division = division;
      return { edit, eventType: "division-delete", popup: true };
    });
  };

  addTeamToggle = division => {
    this.setState(state => {
      let edit = Object.assign({}, state.edit);
      edit.division = division;
      return { edit, eventType: "team-add", popup: true };
    });
  };

  editTeamToggle = team => {
    this.setState(state => {
      let edit = Object.assign({}, state.edit);
      edit.team = team;
      return { edit, eventType: "team-edit", popup: true };
    });
  };

  modalToggle = (fetch = false) => {
    this.setState(state => {
      let edit = Object.assign({}, state.edit);
      edit.division = null;
      return { edit, popup: !this.state.popup, eventType: null };
    });
    if (fetch === true) this.props.onfetchDivisions(this.props.domain);
  };

  collapseDivList = divisionId => {
    var { collapse_div } = this.state;
    var collapse = null;
    if (collapse_div === null) {
      collapse = divisionId;
    } else {
      if (divisionId === collapse_div) collapse = null;
      else collapse = divisionId;
    }
    this.setState({
      collapse_div: collapse
    });
  };

  collapseTeamList = teamId => {
    var { collapse_team } = this.state;
    var collapse = null;
    if (collapse_team === null) {
      collapse = teamId;
    } else {
      if (teamId === collapse_team) collapse = null;
      else collapse = teamId;
    }
    this.setState({
      collapse_team: collapse
    });
  };

  render() {
    return (
      <div className="org_browser">
        <Modal
          isOpen={this.state.popup}
          toggle={this.modalToggle}
          className="modal-dialog-centered"
        >
          <ModalBody>
            {this.state.eventType === "division-add" && (
              <AddDivision toggle={this.modalToggle} />
            )}
            {this.state.eventType === "division-edit" && (
              <EditDivision
                division={this.state.edit.division}
                toggle={this.modalToggle}
              />
            )}
            {this.state.eventType === "division-delete" && (
              <DeleteDivision
                division={this.state.edit.division}
                toggle={this.modalToggle}
              />
            )}
            {this.state.eventType === "team-add" && (
              <AddTeam
                division={this.state.edit.division}
                toggle={this.modalToggle}
              />
            )}
            {this.state.eventType === "team-edit" && (
              <EditTeam team={this.state.edit.team} toggle={this.modalToggle} />
            )}
            {this.state.eventType === "team-delete" && (
              <DeleteTeam
                team={this.state.edit.team}
                toggle={this.modalToggle}
              />
            )}
          </ModalBody>
        </Modal>

        <div className="browser_header text-white">
          <div>
            <i className="fas fa-users submenu-icon"></i>
            <h3 className="d-inline-block">Organisation</h3>
            <img
              src={closeIcon}
              alt="starlify"
              className="system-down-icon"
              onClick={() => this.close("organisation", "menu")}
            />
          </div>
          {this.props.orgid !== "" && (
            <div>
              <Row className="searchbar">
                <Col sm="6">
                  <InputGroup>
                    <Input placeholder="search" />
                    <InputGroupAddon addonType="append">
                      <InputGroupText>
                        <i className="fas fa-search"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Col>
              </Row>
              <div className="addDivisionIcon">
                <span
                  onClick={() => {
                    this.setState({ eventType: "division-add", popup: true });
                  }}
                >
                  <img src={addCircle} alt="starlify" />
                  Add Division
                </span>
              </div>
            </div>
          )}
        </div>

        {this.props.orgid !== "" && (
          <div className="browser_body">
            <VerticalScrollbars
              style={{ height: "calc(100vh - 175px)" }}
              autoHide
            >
              <div className="division_model">
                <div className="browser_body_header text-white"></div>
                <div className="browser_body_content">
                  <div>
                    <ul className="modelListWrapper">
                      {this.props.divisions.length !== 0 &&
                        this.props.divisions.map((division, index) => {
                          return (
                            <li
                              className="modelListbody text-white divisionListItem"
                              key={division.id}
                            >
                              <Row>
                                <Col
                                  sm="7"
                                  className="divisionitemtext"
                                  onClick={() =>
                                    this.collapseDivList(division.id)
                                  }
                                >
                                  {division.teams.length !== 0 && (
                                    <i
                                      className={`fas fa-chevron-${
                                        this.state.collapse_div === division.id
                                          ? "down"
                                          : "right"
                                      }`}
                                    ></i>
                                  )}
                                  {division.name}
                                </Col>
                                <Col sm="5" className="text-center">
                                  <ul className="hoversettings">
                                    <li
                                      onClick={() => {
                                        this.addTeamToggle(division);
                                      }}
                                    >
                                      <img src={addCircle} alt="starlify" />
                                    </li>
                                    <li
                                      onClick={() => {
                                        this.editDivisionToggle(division);
                                      }}
                                    >
                                      <i className="fas fa-pen"></i>
                                    </li>
                                    <li
                                      onClick={() => {
                                        this.deleteDivisionToggle(division);
                                      }}
                                    >
                                      <i className="fas fa-trash-alt"></i>
                                    </li>
                                  </ul>
                                </Col>
                              </Row>

                              <Collapse
                                isOpen={
                                  this.state.collapse_div === division.id
                                    ? true
                                    : false
                                }
                              >
                                <ul className="teamListWrapper">
                                  {division.teams.map((team, index) => {
                                    return (
                                      <li
                                        key={team.id}
                                        className="teamListItem"
                                      >
                                        <Row>
                                          <Col
                                            sm="7"
                                            className="teamitemtext"
                                            onClick={() =>
                                              this.collapseTeamList(team.id)
                                            }
                                          >
                                            {team.persons.length !== 0 && (
                                              <i
                                                className={`fas fa-chevron-${
                                                  this.state.collapse_team ===
                                                  team.id
                                                    ? "down"
                                                    : "right"
                                                }`}
                                              ></i>
                                            )}
                                            {team.name}
                                          </Col>
                                          <Col sm="5" className="text-center">
                                            <ul className="hoversettings">
                                              <li
                                                onClick={() => {
                                                  this.editTeamToggle(team);
                                                }}
                                              >
                                                <i className="fas fa-pen"></i>
                                              </li>
                                            </ul>
                                          </Col>
                                        </Row>

                                        <Collapse
                                          isOpen={
                                            this.state.collapse_team === team.id
                                              ? true
                                              : false
                                          }
                                        >
                                          <ul className="developerListWrapper">
                                            {team.persons.map((person, i) => {
                                              return (
                                                <li
                                                  key={person.id}
                                                  className="developerListItem"
                                                >
                                                  <Row>
                                                    {person.firstName &&
                                                    person.lastName ? (
                                                      <Col
                                                        sm="7"
                                                        className="developeritemtext"
                                                      >
                                                        
                                                        {person.firstName +
                                                          " " +
                                                          person.lastName}
                                                      </Col>
                                                    ) : (
                                                      <Col
                                                        sm="7"
                                                        className="developeritemtext"
                                                      >
                                                        
                                                        Unknown
                                                      </Col>
                                                    )}
                                                  </Row>
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        </Collapse>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </Collapse>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </div>
              </div>
            </VerticalScrollbars>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    domain: state.model.domain,
    orgid: state.organisation.orgid,
    divisions: state.organisation.divisions
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onfetchDivisions: domainId => {
      dispatch(fetchDivisions(domainId));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Organisation);
