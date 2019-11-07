import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";

import check from "../../_assets/icons/icons/check-icon.svg";
import addCircle from "../../_assets/icons/icons/add-icon-circle.svg";

class EditTeam extends Component {

  constructor(props){
    super(props);
    this.state = {
      team_name: props.team.name,
      dev_add: false,
      dev_edit: false,
      dev_data: null,
      dev_firstname: "",
      dev_lastname: "",
      dev_email: "",
      dev_delete: false,
      error: null
    }
  }

  updateTeam = () => {
    const {team} = this.props;
    const {team_name} = this.state;
    if (team_name !== "") {
      fetch( process.env.REACT_APP_API + "/hypermedia/domain/" + this.props.domain + "/organisation/" + team.id,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: team_name })
        }
      )
      .then(res => res.json())
      .then(result => {
        this.props.toggle(true);
      });
    }else{
      this.props.toggle();
    }
  };

  addPerson = () => {
    const {team} = this.props;
    const {dev_firstname, dev_lastname, dev_email} = this.state;
    fetch( process.env.REACT_APP_API + "/hypermedia/domain/" + this.props.domain + "/organisation/" + team.id + "/person", { method: "POST" })
    .then(res => res.json())
    .then(result => {
      fetch( process.env.REACT_APP_API + "/hypermedia/domain/" + this.props.domain + "/person/" + result.id,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: dev_firstname, firstName: dev_firstname, lastName: dev_lastname, emailAddress: dev_email })
        })
        .then(res => res.json())
        .then(result => {
          team.persons.push(result);
          this.setState({
            dev_firstname: "",
            dev_lastname: "",
            dev_email: "",
            dev_add: false
          })
        });
    });
  }

  toggleDevEdit = (person) => {
    var {firstName, lastName, emailAddress} = person;
    this.setState({
      dev_edit: true,
      dev_firstname: firstName,
      dev_lastname: lastName,
      dev_email: emailAddress,
      dev_data: person
    })
  }

  updatePerson = () => {
    const {team} = this.props;
    const {dev_firstname, dev_lastname, dev_email, dev_data} = this.state;
    fetch( process.env.REACT_APP_API + "/hypermedia/domain/" + this.props.domain + "/person/" + dev_data.id,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: dev_firstname, firstName: dev_firstname, lastName: dev_lastname, emailAddress: dev_email })
      }
    )
    .then(res => res.json())
    .then(result => {
      team.persons.forEach((person, i)=>{
        if(person.id === dev_data.id){
          team.persons[i] = result;
        }
      })
      this.setState({
        dev_edit: false,
        dev_firstname: "",
        dev_lastname: "",
        dev_data: ""
      })
    });
  }

  deletePerson = () => {
    const {team} = this.props;
    const {dev_data} = this.state;
    fetch( process.env.REACT_APP_API + "/hypermedia/domain/" + this.props.domain + "/person/" + dev_data.id,
      { method: "DELETE" }
    )
    .then(result => {
      switch (result.status) {
        case 200:
          team.persons = team.persons.filter(function( person ) {
            return person.id !== dev_data.id;
          });
          break;
        default:
      }
      this.setState({ dev_delete: false, dev_data: null })
    })
    .catch(error => {
      console.log(error);
      this.setState({ dev_delete: false, dev_data: null })
    });
  };

  render(){
    const {team} = this.props;
    return(
      <div>
        <div className="editTeam">
          <h3 className="d-inline-block modal-title"> Edit {team.name} </h3>
          <button className="btn grey-btn modal-top-btn" onClick={this.updateTeam.bind(this)}>
            Done <img src={check} alt="" />
          </button>
          <div className="modalSearch">
            <h4>Team name</h4>
            <input type="text" value={this.state.team_name} onChange={(e)=>{this.setState({team_name: e.target.value})}} />
          </div>
          <div className="modalList">
            <h4>Members</h4>
            {team.persons.length !== 0 ? (
              <ul className="members">
                {team.persons.map((person, i)=>{
                  return(
                    <li key={person.id}>
                      {this.state.dev_delete === true && this.state.dev_data.id === person.id ?(
                        <React.Fragment>
                          <div className="col-md-12">
                          <p className="text-center"> Do you really want to delete person {this.state.dev_data.name}? <br /> Process cannot be undone!</p>
                          <div className="delete-button text-center">
                            <button className="btn black-btn" onClick={this.deletePerson.bind(this)} > confirm </button>
                            <button className="btn transparent-black-btn" onClick={()=>{this.setState({ dev_delete: false, dev_data: null })}} > cancel </button>
                            </div>
                          </div>
                        </React.Fragment>

                      ) : (
                        <React.Fragment>
                          <Col sm="4">{person.firstName +" "+ person.lastName}</Col>
                          <Col sm="3">{person.emailAddress}</Col>
                          <Col sm="5" className="text-center">
                            <ul className="settings">
                              <li> <span className="status">Accepted</span> </li>
                              <li onClick={()=>{this.toggleDevEdit(person)}}>
                                <i className="fas fa-pen"></i>
                              </li>
                              <li onClick={()=>{this.setState({ dev_delete: true, dev_data: person })}}>
                                <i className="fas fa-trash-alt"></i>
                              </li>
                            </ul>
                          </Col>
                        </React.Fragment>
                      )}
                    </li>
                  )
                })}
              </ul>
            ):(
              <h1>No members yet</h1>
            )}
          </div>
          <div className="underline"></div>
          <div className="addModal">
            {this.state.dev_add === true && (
              <Row className="justify-content-md-center">
                <Col sm="3">
                  <input type="text" placeholder="Albert" value={this.state.dev_firstname}
                  onChange={(e)=>{this.setState({dev_firstname: e.target.value})}} />
                </Col>
                <Col sm="3">
                  <input type="text" placeholder="Einstein" value={this.state.dev_lastname} onChange={(e)=>{this.setState({dev_lastname: e.target.value})}} />
                </Col>
                <Col sm="4">
                  <input type="text" placeholder="relativitytheory@email.com" value={this.state.dev_email} onChange={(e)=>{this.setState({dev_email: e.target.value})}} />
                </Col>
                <Col sm="1">
                  <button onClick={this.addPerson} className="modalTransparent-btn">Done</button>
                </Col>
              </Row>
            )}
            {this.state.dev_add === false && this.state.dev_edit !== true &&(
              <span onClick={() => (this.setState({ dev_add: true }))}> <img src={addCircle} alt="" /> Add member </span>
            )}
            {this.state.dev_edit === true && (
              <Row>
                <Col sm="3">
                  <input type="text" placeholder="Albert" value={this.state.dev_firstname}
                  onChange={(e)=>{this.setState({dev_firstname: e.target.value})}} />
                </Col>
                <Col sm="3">
                  <input type="text" placeholder="Einstein" value={this.state.dev_lastname} onChange={(e)=>{this.setState({dev_lastname: e.target.value})}} />
                </Col>
                <Col sm="4">
                  <input type="text" placeholder="relativitytheory@email.com" value={this.state.dev_email} onChange={(e)=>{this.setState({dev_email: e.target.value})}} />
                </Col>
                <Col sm="2">
                  <button onClick={this.updatePerson} className="modalTransparent-btn">Update</button>
                </Col>
              </Row>
            )}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    domain: state.model.domain
  };
}

export default connect( mapStateToProps )(EditTeam);
