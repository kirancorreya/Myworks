import React, { Component } from "react";
import { connect } from "react-redux";

import check from "../../_assets/icons/icons/check-icon.svg";

class AddTeam extends Component {

  constructor(props){
    super(props);
    this.state = {
      add_team_name: "",
      error: null
    }
  }

  addTeam = () => {
    const {division} = this.props;
    const {add_team_name} = this.state;
    if (add_team_name !== "") {
      fetch( process.env.REACT_APP_API + "/hypermedia/domain/" + this.props.domain + "/organisation/" + division.id + "/organisation", { method: "POST" } )
        .then(res => res.json())
        .then(result => {
          fetch( process.env.REACT_APP_API + "/hypermedia/domain/" + this.props.domain + "/organisation/" + result.id,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: add_team_name })
              }
            )
            .then(res => res.json())
            .then(result => {
              this.props.toggle(true);
            });
        });
    }else{
      this.props.toggle();
    }
  };

  render(){
    const {division} = this.props;
    return(
      <div className="addTeamInput">
        <h3 className="d-inline-block modal-title"> Add team in {division.name} </h3>
        <button className="btn grey-btn modal-top-btn" onClick={this.addTeam.bind(this)}> Done <img src={check} alt="" /> </button>
        <div className="modalSearch">
          <h4>Team name</h4>
          <input type="text" onChange={(e)=>{this.setState({add_team_name: e.target.value})}} value={this.state.add_team_name} />
        </div>
        <div className="modalList">
          <h4>Members</h4>
          <h1>No members yet</h1>
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

export default connect( mapStateToProps )(AddTeam);
