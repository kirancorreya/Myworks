import React, { Component } from "react";
import { fetchFlowDetils } from "../../../store/system/systemActions";
import { connect } from "react-redux";
import { Modal, ModalBody, FormGroup, Input } from "reactstrap";
import Select from "react-select";
import check from "../../../_assets/icons/icons/check-icon.svg";
import addCircle from "../../../_assets/icons/icons/add-icon-circle.svg";
import sequence from "../../../_assets/images/Sequence-diagram.png";
import edit from "../../../_assets/icons/icons/edit.svg";
import Reorder from "react-reorder";
import closeIcon from "../../../_assets/icons/icons/exitwhite.svg";
import VerticalScrollbars from "../../../_assets/Scrollbars/VerticalScrollbars";

class FlowDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: {},
      formData: {
        name: "",
        description: "",
        supportLevel: "",
        custom: { documentationUrl: "" }
      },
      filterOptions: [],
      invocations: [],
      referenceData: {
        consumerSystem: "",
        consumedService: "",
        referenceName: ""
      },
      servicesList: "",
      invocationsList: [],
      items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"],
      referenceAdd: false
    };

    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleDescription = this.toggleDescription.bind(this);
    this.modalToggle = this.modalToggle.bind(this);
  }
  onReorder(event, previousIndex, nextIndex, fromId, toId) {
    fetch(
      process.env.REACT_APP_API +
        `/hypermedia/network/${this.props.activeModelId}/flow/${this.props.activeFlow}/invocation/` +
        this.props.invocations[previousIndex].invocationId,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index: nextIndex })
      }
    )
      .then(response => {
        this.props.getFlowDetails(
          this.props.activeModelId,
          this.props.activeFlow
        );
      })
      .catch(error => console.log(error));
  }

  //show or hide tool tip
  toggle = target => {
    this.setState({
      ...this.state,
      [target]: !this.state[target]
    });
  };

  handleUrlChange(event) {
    const { formData } = this.state;
    formData[event.target.name] = { documentationUrl: event.target.value };
    this.setState({
      formData
    });
  }

  handleChange(event) {
    const { formData } = this.state;
    formData[event.target.name] = event.target.value;
    this.setState({
      formData
    });
  }

  handleReferenceChange(event) {
    const { referenceData } = this.state;
    referenceData[event.target.name] = event.target.value;
    this.setState({
      referenceData
    });
    console.log(referenceData);
  }

  openAddReference(event) {
    this.setState(prev => ({
      referenceAdd: !prev.referenceAdd
    }));
  }

  updateFlow() {
    fetch(
      process.env.REACT_APP_API +
        `${this.props.activeModel}/flow/` +
        this.props.activeFlow,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.state.formData)
      }
    )
      .then(response => {
        if (this.state.deletedSourceSystems.length > 0)
          this.deleteSourceSystems();
        if (this.state.deletedTargetSystems.length > 0)
          this.deleteTargetSystems();
        this.addSourceSystems();
        this.addTargetSystems();
        setTimeout(() => {
          this.props.getFlowDetails(
            this.props.activeModelId,
            this.props.activeFlow
          );
          this.setState(prevState => ({
            modal: !prevState.modal
          }));
        }, 2000);
      })
      .catch(error => console.log(error));
  }

  addSourceSystems() {
    console.log(this.state.sourceSystems);
    this.state.sourceSystems.map((system, i) => {
      fetch(
        process.env.REACT_APP_API +
          "/hypermedia/network/" +
          this.props.activeModelId +
          "/flow/" +
          this.props.activeFlow +
          "/source/" +
          system.value,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
        .then(response => {})
        .catch(error => console.log(error));
      return true;
    });
  }

  addTargetSystems() {
    this.state.targetSystems.map((system, i) => {
      fetch(
        process.env.REACT_APP_API +
          "/hypermedia/network/" +
          this.props.activeModelId +
          "/flow/" +
          this.props.activeFlow +
          "/target/" +
          system.value,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
        .then(response => {})
        .catch(error => console.log(error));
      return true;
    });
  }

  deleteSourceSystems() {
    this.state.deletedSourceSystems.map((system, i) => {
      fetch(
        process.env.REACT_APP_API +
          "/hypermedia/network/" +
          this.props.activeModelId +
          "/flow/" +
          this.props.activeFlow +
          "/source/" +
          system.value,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
        .then(response => {})
        .catch(error => console.log(error));
      return true;
    });
  }

  deleteTargetSystems() {
    console.log(this.state.deletedTargetSystems);
    this.state.deletedTargetSystems.map((system, i) => {
      fetch(
        process.env.REACT_APP_API +
          "/hypermedia/network/" +
          this.props.activeModelId +
          "/flow/" +
          this.props.activeFlow +
          "/target/" +
          system.value,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
        .then(response => {})
        .catch(error => console.log(error));
      return true;
    });
  }

  handleSourceChange(option, event) {
    console.log(option);
    let difference = this.state.sourceSystems.filter(x => !option.includes(x)); // calculates diff
    console.log(difference);
    if (difference.length > 0) {
      this.state.deletedSourceSystems.push(difference[0]);
    }
    this.setState(state => {
      return {
        sourceSystems: option
      };
    });
  }

  handleTargetChange(option) {
    let difference = this.state.targetSystems.filter(x => !option.includes(x)); // calculates diff
    if (difference.length > 0) {
      this.state.deletedTargetSystems.push(difference[0]);
    }
    this.setState(state => {
      return {
        targetSystems: option
      };
    });
  }

  //show or hide description
  toggleDescription() {
    this.setState(state => ({ collapse: !state.collapse }));
  }

  //closes the detail window
  close(type) {
    this.props.close(type);
  }
  componentWillReceiveProps(nextProps) {
    this.state.flow = nextProps.invocations;
    console.log(nextProps.invocations);
  }

  //update flow details
  updateFlowDetails(event) {
    let value = event.target.value;
    if (
      (event.key === "Enter" || event.type === "blur") &&
      this.state.modal &&
      value
    ) {
      event.target.value = "";
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
      fetch(
        process.env.REACT_APP_API +
          `${this.props.activeModel}/flow/` +
          this.props.activeFlow,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: value })
        }
      )
        .then(response => {
          this.props.getFlowDetails(
            this.props.activeModel,
            this.props.activeFlow
          );
        })
        .catch(error => console.log(error));
    }
  }

  //Delete entity
  deleteReference(referenceId, event) {
    console.log(referenceId);
    return fetch(
      process.env.REACT_APP_API +
        "/model/" +
        this.props.activeModelId +
        "/flow/" +
        this.props.activeFlow +
        "/invocation/" +
        referenceId,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      }
    ).then(response => {
      this.props.getFlowDetails(
        this.props.activeModelId,
        this.props.activeFlow
      );
    });
  }

  //control right click modal
  modalToggle(e, data) {
    this.state.sourceSystems = [];
    this.state.targetSystems = [];
    this.state.deletedSourceSystems = [];
    this.state.deletedTargetSystems = [];
    this.setState(prevState => ({
      modal: !prevState.modal
    }));

    this.props.flowDetails._links
      .filter(links => links.rel === "SOURCE")
      .map(source => {
        console.log(source);
        this.state.sourceSystems.push({
          value: source.params.id,
          label: source.title
        });
        return true;
      });

    this.props.flowDetails._links
      .filter(links => links.rel === "TARGET")
      .map(target => {
        this.state.targetSystems.push({
          value: target.params.id,
          label: target.title
        });
      });

    this.setState({
      formData: {
        name: this.props.flowDetails.name,
        description: this.props.flowDetails.description,
        supportLevel: this.props.flowDetails.supportLevel,
        custom: {
          documentationUrl: this.props.flowDetails.custom.documentationUrl
        }
      }
    });
    this.getSystems();
  }

  getSystems() {
    return fetch(
      process.env.REACT_APP_API +
        "/hypermedia/network/" +
        this.props.activeModelId +
        "/allsystems"
    )
      .then(res => res.json())
      .then(response => {
        this.setState({ systems: response });
        response.map((systems, i) => {
          this.state.filterOptions.push({
            value: systems.id,
            label: systems.name
          });
        });
        return true;
      })
      .catch(error => console.log(error));
  }

  getSystemServices(event) {
    let parents = this.state.systems;
    let parent = parents.filter(parent => parent.name === event.target.value);
    if (parent) this.setState({ servicesList: parent[0].services });
  }

  //create service
  createReference(event) {
    fetch(
      process.env.REACT_APP_API +
        `/hypermedia/network/${this.props.activeModelId}/system/${this.state.referenceData.consumerSystem}/reference/service/${this.state.referenceData.consumedService}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        return fetch(
          process.env.REACT_APP_API +
            `${this.props.activeModel}/service/${this.props.activeFlow}/invocation/` +
            responseJson.id,

          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
          .then(response => response.json())
          .then(responseJson => {
            setTimeout(() => {
              this.props.getFlowDetails(
                this.props.activeModelId,
                this.props.activeFlow
              );

              this.setState(prevState => ({
                modal: true
              }));
            }, 2000);
          });
      });
  }

  render() {
    var { formData } = this.state;
    return (
      <div className="browser">
        <Modal isOpen={this.state.modal} toggle={this.modalToggle}>
          <ModalBody>
            <div className="editFlow">
              <h3 className="d-inline-block modal-title">Edit Flow Details</h3>
              <button
                className="btn grey-btn modal-top-btn"
                onClick={this.updateFlow.bind(this)}
              >
                Done <img src={check} alt="" />
              </button>
              <div className="ModalInput m-t-50">
                <h4>Flow name</h4>
                <input
                  type="text"
                  value={formData.name}
                  name="name"
                  onChange={this.handleChange.bind(this)}
                />
              </div>
              <div className="ModalInput">
                <FormGroup>
                  <Input
                    className="select-css"
                    type="select"
                    name="supportLevel"
                    value={formData.supportLevel}
                    onChange={this.handleChange.bind(this)}
                  >
                    <option value="">Support Level</option>
                    <option value="1">Gold</option>
                    <option value="2">Platinum</option>
                    <option value="3">Silver</option>
                    ))}
                  </Input>
                </FormGroup>
              </div>
              <div className="ModalInput">
                <h4>Documentation URL</h4>
                <input
                  type="text"
                  name="custom"
                  value={formData.custom.documentationUrl}
                  onChange={this.handleUrlChange.bind(this)}
                />
              </div>
              <div className="ModalInput">
                <h4>Description</h4>
                <textarea
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={this.handleChange.bind(this)}
                />
              </div>
              <div className="ModalInput">
                <h4>Source system</h4>
                <div className="searchbar">
                  <div sm="12">
                    <Select
                      name="filters"
                      placeholder=""
                      value={this.state.sourceSystems}
                      options={this.state.filterOptions}
                      onChange={this.handleSourceChange.bind(this)}
                      multi
                      clearable={false}
                    />
                  </div>
                </div>
              </div>
              <div className="ModalInput">
                <h4>Target system</h4>
                <div className="searchbar">
                  <div sm="12">
                    <Select
                      name="filters"
                      placeholder=""
                      value={this.state.targetSystems}
                      options={this.state.filterOptions}
                      onChange={this.handleTargetChange.bind(this)}
                      multi
                      clearable={false}
                    />
                  </div>
                </div>
              </div>
              <div className="technical row">
                <div className="technical-header col-md-12">
                  <span className="">Technical</span>
                  {!this.state.referenceAdd && (
                    <div className="addModal">
                      <span onClick={this.openAddReference.bind(this)}>
                        <img src={addCircle} alt="starlify" />
                        Add Contract
                      </span>
                    </div>
                  )}
                </div>
                <div className="technical-body col-md-12">
                  <ul className="row head">
                    <li className="col-md-1"></li>
                    <li className="col-md-4">Consumer</li>
                    <li className="col-md-3">Provider</li>
                    <li className="col-md-3">Service</li>
                    <li className="col-md-1"></li>
                  </ul>
                  <Reorder
                    reorderId="my-list" // Unique ID that is used internally to track this list (required)
                    reorderGroup="reorder-group" // A group ID that allows items to be dragged between lists of the same group (optional)
                    component="ul" // Tag name or Component to be used for the wrapping element (optional), defaults to 'div'
                    placeholderClassName="placeholder" // Class name to be applied to placeholder elements (optional), defaults to 'placeholder'
                    draggedClassName="dragged" // Class name to be applied to dragged elements (optional), defaults to 'dragged'
                    lock="horizontal" // Lock the dragging direction (optional): vertical, horizontal (do not use with groups)
                    holdTime={500} // Default hold time before dragging begins (mouse & touch) (optional), defaults to 0
                    touchHoldTime={500} // Hold time before dragging begins on touch devices (optional), defaults to holdTime
                    mouseHoldTime={200} // Hold time before dragging begins with mouse (optional), defaults to holdTime
                    onReorder={this.onReorder.bind(this)} // Callback when an item is dropped (you will need this to update your state)
                    autoScroll={true} // Enable auto-scrolling when the pointer is close to the edge of the Reorder component (optional), defaults to true
                    disabled={false} // Disable reordering (optional), defaults to false
                    disableContextMenus={true} // Disable context menus when holding on touch devices (optional), defaults to true
                    placeholder={
                      <div className="custom-placeholder" /> // Custom placeholder element (optional), defaults to clone of dragged element
                    }
                  >
                    {this.props.invocations.map((invocation, i) => {
                      return (
                        <li>
                          <ul className="row body">
                            <li className="col-md-1">
                              <i className="fas fa-bars"></i>
                            </li>
                            <li className="col-md-4 text-white">
                              {invocation.consumer}
                            </li>
                            <li className="col-md-3 text-white">
                              {invocation.provider}
                            </li>
                            <li className="col-md-3 text-white word-wrap">
                              {invocation.service}
                            </li>
                            <li className="col-md-1 text-white">
                              <i
                                className="fas fa-trash-alt"
                                onClick={this.deleteReference.bind(
                                  this,
                                  invocation.invocationId
                                )}
                              ></i>
                            </li>
                          </ul>
                        </li>
                      );
                    })}
                  </Reorder>
                  <div className="sequence"></div>
                </div>
                {this.state.referenceAdd && (
                  <div className="d-block mx-auto">
                    <ul className="d-flex formGroupWrapper justify-content-md-center create-ref">
                      <li className="form-group">
                        <Input
                          type="select"
                          name="consumerSystem"
                          onChange={this.handleReferenceChange.bind(this)}
                          className="p-l-0"
                        >
                          <option>Consumer System</option>
                          {this.state.systems
                            ? this.state.systems.map((item, i) => {
                                return (
                                  <option key={i} value={item.id} id={item.id}>
                                    {item.name}
                                  </option>
                                );
                              })
                            : ""}
                        </Input>
                      </li>
                      <li className="form-group">
                        <Input
                          type="select"
                          name="select"
                          onChange={this.getSystemServices.bind(this)}
                        >
                          <option>Provider System</option>
                          {this.state.systems
                            ? this.state.systems.map((item, i) => {
                                return (
                                  <option
                                    key={i}
                                    value={item.name}
                                    id={item.id}
                                  >
                                    {item.name}
                                  </option>
                                );
                              })
                            : ""}
                        </Input>
                      </li>
                      <li className="form-group">
                        <Input
                          type="select"
                          name="consumedService"
                          id="exampleSelect"
                          onChange={this.handleReferenceChange.bind(this)}
                        >
                          <option>Service</option>
                          {this.state.servicesList
                            ? this.state.servicesList.map((item, i) => {
                                return (
                                  <option key={i} value={item.id}>
                                    {item.name}
                                  </option>
                                );
                              })
                            : ""}
                        </Input>
                      </li>
                      <li className="form-group">
                        <button
                          className="link-btn modal-top-btn m-l-15"
                          onClick={this.createReference.bind(this)}
                        >
                          Done
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>
        </Modal>

        <div className="browser_header text-white">
          <div>
            <span className="icon icon-Share submenu-icon" />

            <h3 className="d-inline-block">Flow Details</h3>

            <img
              src={edit}
              alt="starlify"
              className="edit"
              onClick={() => this.modalToggle(this, this.props.flowDetails)}
            />
            <img
              src={closeIcon}
              alt="starlify"
              className="system-down-icon browser_close"
              onClick={() => this.close("flowDetail")}
            />
          </div>
        </div>
        <div className="browser_wrapper browser_body">
          <VerticalScrollbars
            style={{ height: "calc(100vh - 120px)" }}
            autoHide
          >
            <div className="name m-b-20">
              <h5 className="text-grey m-b-0 text-title">Name</h5>
              <p className="text-white">{this.props.flowDetails.name}</p>
            </div>
            <div className="support m-b-20">
              <h5 className="text-grey m-b-0 text-title">Support level</h5>
              {this.props.flowDetails.supportLevel === 1 && (
                <p className="text-white">Gold</p>
              )}
              {this.props.flowDetails.supportLevel === 2 && (
                <p className="text-white">Platinum</p>
              )}
              {this.props.flowDetails.supportLevel === 3 && (
                <p className="text-white">Silver</p>
              )}
            </div>
            <div className="url m-b-20">
              <h5 className="text-grey m-b-0 text-title">Documentation URL</h5>
              <p className="text-white">
                {this.props.flowDetails.custom
                  ? this.props.flowDetails.custom.documentationUrl
                  : ""}
              </p>
            </div>
            <div className="desc m-b-20">
              <h5 className="text-grey m-b-0 text-title">Description</h5>
              <p className="text-white">{this.props.flowDetails.description}</p>
            </div>
            <div className="system m-b-20">
              <h5 className="text-grey m-b-0 text-title">Source</h5>
              {this.props.flowDetails._links
                ? this.props.flowDetails._links
                    .filter(links => links.rel === "SOURCE")
                    .map(source => {
                      return <p className="text-white">{source.title}</p>;
                    })
                : ""}
            </div>
            <div className="target m-b-20">
              <h5 className="text-grey m-b-0 text-title">Target</h5>
              {this.props.flowDetails._links
                ? this.props.flowDetails._links
                    .filter(links => links.rel === "TARGET")
                    .map(target => {
                      return <p className="text-white">{target.title}</p>;
                    })
                : ""}
            </div>
            <div className="technical row">
              <div className="technical-header col-md-12">
                <h5 className="text-white m-b-0 text-title">Technical</h5>
              </div>
              <div className="technical-body col-md-12">
                <ul className="row">
                  <li className="col-md-4">Consumer</li>
                  <li className="col-md-3">Provider</li>
                  <li className="col-md-3">Service</li>
                </ul>
                {this.props.invocations.map((invocation, i) => {
                  return (
                    <ul className="row">
                      <li className="col-md-4 text-white">
                        
                        {invocation.consumer}
                      </li>
                      <li className="col-md-3 text-white">
                        {invocation.provider}
                      </li>
                      <li className="col-md-3 text-white word-wrap">
                        
                        {invocation.service}
                      </li>
                    </ul>
                  );
                })}

                <div className="sequence">
                  <img
                    src={sequence}
                    alt="starlify"
                    className="d-block mx-auto"
                  />
                </div>
              </div>
            </div>
          </VerticalScrollbars>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getFlowDetails: (modelId, flowId) => {
      dispatch(fetchFlowDetils(modelId, flowId));
    }
  };
}

function mapStateToProps(state) {
  return {
    activeSystem: state.model.activeSystem,
    activeFlow: state.system.activeFlow,
    activeModel: state.model.modelUri,
    flowDetails: state.system.flowDetails,
    invocations: state.system.invocations,
    activeModelId: state.model.modelId
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlowDetails);
