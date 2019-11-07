import React, { Component } from "react";
import { connect } from "react-redux";

class DeleteTeam extends Component {

  constructor(props){
    super(props);
    this.state = {
      error: null
    }
  }

  removeTeam = () => {
    const {team} = this.props;
    fetch( process.env.REACT_APP_API + "/hypermedia/domain/" + this.props.domain + "/organisation/" + team.id,
      { method: "DELETE" }
    ).then(result => {
      switch (result.status) {
        case 200:
          this.props.toggle(true);
          break;
        case 403:
          this.setState({ error: "403" });
          break;
        default:
      }
    });
  };


  render(){
    const {team} = this.props;
    return(
        <div>
          {this.state.error === "403" && (
            <div>
              <h4 className="text-center">Unable to delete!</h4>
              <p className="text-center"> Please check section contains any child objects before try to remove. </p>
              <div className="delete-button text-center">
                <button className="btn black-btn" onClick={this.props.toggle} > cancel </button>
              </div>
            </div>
          )}

          {this.state.error === null && (
            <div>
              <h4 className="text-center">Are you sure?</h4>
              <p className="text-center"> Do you really want to delete team {team.name}? <br /> Process cannot be undone </p>
              <div className="delete-button text-center">
                <button className="btn black-btn" onClick={this.removeTeam.bind(this)} > confirm </button>
                <button className="btn transparent-black-btn" onClick={this.props.toggle} > cancel </button>
              </div>
            </div>
          )}
        </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    domain: state.model.domain
  };
}

export default connect( mapStateToProps )(DeleteTeam);
