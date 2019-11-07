import React from "react";
import { ListGroupItem, Collapse } from "reactstrap";

class CollapseList extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.toggle(this.props.cat);
  }

  render() {
    const cat = this.props.cat;
    //let date = cat.createdAt.toISOString();
    //date = date.substring(0, date.indexOf('T'));
    return (
      <div>
        <p onClick={this.toggle}>
          <strong>{cat.title}</strong>
        </p>
        <Collapse isOpen={this.props.isOpen}>{cat.title}</Collapse>
      </div>
    );
  }
}

export default CollapseList;
