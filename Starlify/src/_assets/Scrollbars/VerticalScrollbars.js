import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

export default class VerticalScrollbars extends Component {

    constructor(props, ...rest) {
        super(props, ...rest);
        this.state = { top: 0 };
        this.handleUpdate = this.handleUpdate.bind(this);
        this.renderView = this.renderView.bind(this);
        this.renderThumb = this.renderThumb.bind(this);
    }

    handleUpdate(values) {
        const { top } = values;
        this.setState({ top });
    }

    renderView({ style, ...props }) {
        const viewStyle = {
            padding: 15,
            backgroundColor: `transparent`,
            
        };
        return (
            <div
                className="box"
                style={{ ...style, ...viewStyle }}
                {...props}/>
        );
    }

    renderThumb({ style, ...props }) {
        const thumbStyle = {
            backgroundColor: `#939393`
        };
        return (
            <div
                style={{ ...style, ...thumbStyle }}
                {...props}/>
        );
    }

    render() {
        return (
            <Scrollbars
            renderView={this.renderView}
            renderThumbHorizontal={this.renderThumb}
            renderThumbVertical={this.renderThumb}
            onUpdate={this.handleUpdate}
            {...this.props}/>
        );
    }
}