import React, { Component } from "react";
import VerticalScrollbars from "../../../_assets/Scrollbars/VerticalScrollbars";

export default class OrganisationDetails extends Component {

  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
  }

  close(menu) {
    this.props.close(menu);
  }

  render() {
    return (
      <div className="org_browser">
        <h3 className="text-center text-white">
          Organisation Details
          <i className="fas fa-times system-down-icon browser_close" onClick={() => this.close('orgDetail')} />
        </h3>
        <VerticalScrollbars autoHide>
          <div className="browser_wrapper">
            <div className="org-selector">
              <p className="text-white text-left">Edit</p>
              <input type="text" className="search-input" />
              <span className="icon icon-Search search-icon" />
            </div>
            <div className="ob-block row">
              <div className="col-md-8 m-b-20">
                <p className="text-white text-left">Division</p>
              </div>
              <div className="col-md-4 row m-b-20">
                <button className="btn green-btn f-right">Follow</button>
              </div>
              <div className="col-md-8">
                <p className="text-grey text-left">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et
                </p>
              </div>
              <div className="col-md-4 row">
                <div className="col-md-6">
                  <span className="icon icon-EmptyBox menu-icon text-center" />
                  <p className="text-grey text-center">23</p>
                </div>
                <div className="col-md-6">
                  <span className="icon icon-Share menu-icon text-center" />
                  <p className="text-grey text-center">23</p>
                </div>
              </div>
            </div>
            <div className="ob-block row">
              <div className="col-md-8 m-b-20">
                <p className="text-white text-left">Team</p>
              </div>
              <div className="col-md-4 row m-b-20">
                <button className="btn green-btn f-right">Follow</button>
              </div>
              <div className="col-md-8">
                <p className="text-grey text-left">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et
                </p>
              </div>
              <div className="col-md-4 row">
                <div className="col-md-6">
                  <span className="icon icon-EmptyBox menu-icon text-center" />
                  <p className="text-grey text-center">23</p>
                </div>
                <div className="col-md-6">
                  <span className="icon icon-Share menu-icon text-center" />
                  <p className="text-grey text-center">23</p>
                </div>
              </div>
            </div>
            <div className="ob-block row">
              <div className="col-md-8 m-b-20">
                <p className="text-white text-left">Developer</p>
              </div>
              <div className="col-md-4 row m-b-20">
                <button className="btn green-btn f-right">Follow</button>
              </div>
              <div className="col-md-8">
                <p className="text-grey text-left">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et
                </p>
              </div>
              <div className="col-md-4 row">
                <div className="col-md-6">
                  <span className="icon icon-EmptyBox menu-icon text-center" />
                  <p className="text-grey text-center">23</p>
                </div>
                <div className="col-md-6">
                  <span className="icon icon-Share menu-icon text-center" />
                  <p className="text-grey text-center">23</p>
                </div>
              </div>
            </div>
          </div>
        </VerticalScrollbars>
      </div>
    );
  }
}
