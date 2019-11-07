import React, { Component } from "react";
import VerticalScrollbars from "../../../_assets/Scrollbars/VerticalScrollbars";
import closeIcon from "../../../_assets/icons/icons/exitwhite.svg";
export default class Mathew extends Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
  }
  close(type) {
    this.props.close(type);
  }
  render() {
    return (
      <div className="org_browser">
        <h3 className="text-center text-white">
          Tagger Editor
          <img
            src={closeIcon}
            alt="starlify"
            className="system-down-icon"
            onClick={() => this.close("tagger")}
          />
        </h3>
        <VerticalScrollbars style={{ width: 350 }} autoHide>
          <div className="browser_wrapper">
            <div className="org-selector">
              <p className="text-white text-left">Edit</p>
              <input type="text" className="search-input" />
              <span className="icon icon-Search search-icon" />
            </div>
            <div className="systems w-100 d-inline-block">
              <VerticalScrollbars style={{ height: 220 }}>
                <p className="text-white text-left">
                  <span className="text-grey">01.</span> name: "Gant"
                </p>
              </VerticalScrollbars>
            </div>
          </div>
        </VerticalScrollbars>
      </div>
    );
  }
}
