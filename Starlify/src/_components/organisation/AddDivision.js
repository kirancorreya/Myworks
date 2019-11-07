import React, { Component } from "react";
import { connect } from "react-redux";

import check from "../../_assets/icons/icons/check-icon.svg";

class AddDivision extends Component {

  constructor(props){
    super(props);
    this.state = {
      add_div_name: "",
      error: null
    }
  }

  addDivision = () => {
    const {add_div_name} = this.state;
    if (add_div_name !== "") {
      fetch( process.env.REACT_APP_API + "/hypermedia/domain/" + this.props.domain + "/organisation/" + this.props.orgid + "/organisation", { method: "POST" } )
        .then(res => res.json())
        .then(result => {
          fetch( process.env.REACT_APP_API + "/hypermedia/domain/" + this.props.domain + "/organisation/" + result.id,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: add_div_name })
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
    return(
      <div className="addingModal">
        <h3 className="d-inline-block modal-title">Add Division</h3>
        <button className="btn grey-btn modal-top-btn" onClick={this.addDivision.bind(this)}> Done <img src={check} alt="" /> </button>
        <div className="modalSearch">
          <h4>Division name</h4>
          <input type="text" onChange={(e)=>{this.setState({add_div_name: e.target.value})}} value={this.state.add_div_name} />
        </div>
        <div className="modalList">
          <h4>Teams</h4>
          <h1>No teams yet</h1>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    domain: state.model.domain,
    orgid: state.organisation.orgid
  };
}

export default connect(
  mapStateToProps
)(AddDivision);
