import React, { Component } from 'react';
import {toggleFullScreen} from '../_helpers/shortkeys';
import { Tooltip } from 'reactstrap';

class RightButtons extends Component {
	
	constructor(){
		super();
		this.updateFullscreen = this.updateFullscreen.bind(this);
		this.updateReload = this.updateReload.bind(this);
		this.state = {
			fullscreen: false,
			tooltipScreen: false,
			tooltipReset: false,
		};
	}

	updateFullscreen(){
		toggleFullScreen();
		const currentState = this.state.fullscreen;
        this.setState({ fullscreen: !currentState });
	}
	updateReload (){
		window.location.reload(true);
	}

  render() {
	
    return (
      <div className="RightButtons">
        <ul className="right-btns">
			<li>
				<button onClick={this.updateFullscreen} id="screenbtn"><span className={this.state.fullscreen ? 'icon icon-ExitFullScreen': 'icon icon-FullScreen'}></span></button>
				<Tooltip placement="right" isOpen={this.state.tooltipScreen} target="screenbtn" toggle={() => { this.setState({ tooltipScreen: !this.state.tooltipScreen})}}>Fullscreen</Tooltip>
				</li>
			<li>
				<button onClick={this.updateReload} id="resetbtn"><span className="icon icon-Restart"></span></button>
				<Tooltip placement="right" isOpen={this.state.tooltipReset} toggle={() => { this.setState({ tooltipReset: !this.state.tooltipReset})}} target="resetbtn" >Reset View</Tooltip>
			</li>
		</ul>
      </div>
    )
  }
}

export default RightButtons;
