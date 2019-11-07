import React, { Component } from "react";
import { Col } from "reactstrap";
import { connect } from "react-redux";

import addCircle from "../../_assets/icons/icons/add-icon-circle.svg";
import check from "../../_assets/icons/icons/check-icon.svg";

import AddTeam from "./AddTeam";
import EditTeam from "./EditTeam";
import DeleteTeam from "./DeleteTeam";
import { fetchTeams } from "../../_helpers/FetchTeams";

class EditDivision extends Component {
  constructor(props){
    super(props);
    this.state = {
      division: props.division,
      division_name: props.division.name,
      team_add: false,
      team_edit: false,
      team_delete: false,
      team_data: null
    }
  }

  updateDivision = () => {
    var name = this.state.division_name;
    fetch( process.env.REACT_APP_API + "/hypermedia/domain/" + this.props.domain + "/organisation/" + this.props.division.id,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name })
      }
    )
    .then(res => res.json())
    .then(result => {
      this.props.toggle(true);
    });
  };

  toggleTeam = (fetch = false) => {
    const {division} = this.state;
    this.setState({
      team_add: false,
      team_edit: false,
      team_delete: false,
      team_data: null
    })
    if (fetch === true) {
      fetchTeams(this.props.domain, division.id).then((teams)=>{
        let update = Object.assign({}, division);
        if (teams.length !== 0) {
          update.teams = teams;
        }else{
          update.teams = [];
        }
        this.setState({
          division: update
        })
      })
    }
  }

  render(){
    const {division} = this.state;
    return(
      <React.Fragment>
        {this.state.team_edit === false && this.state.team_delete === false && this.state.team_add === false && (
          <div className="editDivision">
            <h3 className="d-inline-block modal-title"> Edit for {division.name} </h3>
            <button className="btn grey-btn modal-top-btn" onClick={this.updateDivision.bind(this)}>Done<img src={check} alt="" /></button>
            <div className="modalSearch">
              <h4>Division name</h4>
              <input type="text" value={this.state.division_name} onChange={(e)=>{this.setState({division_name: e.target.value})}}/>
            </div>
            <div className="modalList">
              <h4>Teams</h4>
              {division.teams.length !== 0 ? (
                <ul>
                  {division.teams.map((team,i)=>{
                    return(
                      <li key={"team_"+i}>
                        <Col sm="9">{team.name}</Col>
                        <Col sm="3" className="text-center">
                          <ul className="settings">
                            <li onClick={()=>{this.setState({team_edit: true, team_data: team})}}>
                              <i className="fas fa-pen"></i>
                            </li>
                            <li onClick={()=>{this.setState({team_delete: true, team_data: team})}}>
                              <i className="fas fa-trash-alt"></i>
                            </li>
                          </ul>
                        </Col>
                      </li>
                    )
                  })}
                </ul>
              ):(
                <h1>No teams yet</h1>
              )}
            </div>
            <div className="underline"></div>
            <div className="addModal">
              <span onClick={()=>{this.setState({team_add: true})}}> <img src={addCircle} alt="" /> Add team </span>
            </div>
          </div>
        )}

        {this.state.team_edit &&(
          <EditTeam team={this.state.team_data} toggle={this.toggleTeam} />
        )}

        {this.state.team_delete &&(
          <DeleteTeam team={this.state.team_data} toggle={this.toggleTeam} />
        )}

        {this.state.team_add &&(
          <AddTeam division={division} toggle={this.toggleTeam} />
        )}
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    domain: state.model.domain
  };
}

export default connect(
  mapStateToProps
)(EditDivision);
