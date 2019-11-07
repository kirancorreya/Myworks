import React, { Component } from "react";
import VerticalScrollbars from "../../../_assets/Scrollbars/VerticalScrollbars";
import { fetchSystemDetils } from "../../../store/system/systemActions";
import { fetchModel } from "../../../store/model/modelActions";
import { connect } from "react-redux";
import { Collapse, Modal, ModalBody, Input, Label } from "reactstrap";
import edit from "../../../_assets/icons/icons/edit.svg";
import closeIcon from "../../../_assets/icons/icons/exitwhite.svg";

class SystemDetails extends Component {
  constructor(props) {
    super(props);
    this.systemInput = React.createRef();
    this.serviceInput = React.createRef();
    this.state = {
      collapse: true,
      systemCollapseId: false,
      subSystemCollapseId: false,
      modal: false,
      editSubSystem: false,
      details: {},
      formData: {
        name: "",
        description: "",
        supportLevel: ""
      },
      subsystemName: "",
      serviceName: ""
    };
    this.close = this.close.bind(this);
    this.toggleDescription = this.toggleDescription.bind(this);
    this.toggle = this.toggle.bind(this);
    this.modalToggle = this.modalToggle.bind(this);
    this.updateSystem = this.updateSystem.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addUiToggle = this.addUiToggle.bind(this);
    this.textInput = React.createRef();
    this.focus = this.focus.bind(this);
  }
  componentWillUpdate() {
    this.focus();
  }
  focus() {
    setTimeout(() => {
      if (this.systemInput.current) {
        this.systemInput.current.focus();
      }
      if (this.serviceInput.current) {
        this.serviceInput.current.focus();
      }
    }, 500);

    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
  }

  //manage add more system/flow text box to ui
  addUiToggle(event, type) {
    if (type === "system") {
      this.setState(state => ({ systemAdd: !state.systemAdd }));
    } else if (type === "service") {
      this.setState(state => ({ serviceAdd: !state.serviceAdd }));
    } else if (type === "reference") {
      this.setState(state => ({ referenceAdd: !state.referenceAdd }));
    }
  }

  editfield(key, title, type) {
    if (type === "subsystem") {
      this.setState({ ["subsystem-" + key]: true });
      this.setState({ ["subsystem-value-" + key]: title });
    } else if (type === "service") {
      this.setState({ ["service-" + key]: true });
      this.setState({ ["service-value-" + key]: title });
    } else if (type === "reference") {
      this.setState({ ["reference-" + key]: true });
      this.setState({ ["reference-value-" + key]: title });
    }
  }

  editFieldChange(key, type, event) {
    if (type === "subsystem") {
      this.setState({ ["subsystem-" + key]: true });
      this.setState({ ["subsystem-value-" + key]: event.target.value });
    } else if (type === "service") {
      this.setState({ ["service-" + key]: true });
      this.setState({ ["service-value-" + key]: event.target.value });
    } else if (type === "reference") {
      this.setState({ ["reference-" + key]: true });
      this.setState({ ["reference-value-" + key]: event.target.value });
    }
  }

  updateEntity(key, uri, type) {
    var value = "";
    var id = "";
    if (type === "system") {
      let splitArray = uri.split("/");
      if (splitArray.length > 0) id = splitArray[4];
      this.setState({ ["subsystem-" + key]: false });
      value = this.state[`subsystem-value-${key}`];
    } else if (type === "service") {
      this.setState({ ["service-" + key]: false });
      id = uri;
      value = this.state[`service-value-${key}`];
    } else if (type === "reference") {
      id = uri;
      this.setState({ ["reference-" + key]: false });
      value = this.state[`reference-value-${key}`];
    }

    fetch(
      process.env.REACT_APP_API +
        `/model/${this.props.activeModelId}/${type}/` +
        id,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: value })
      }
    ).then(response => {
      this.props.getSystems(this.props.activeModelId);
      this.props.getSystemDetails(
        this.props.activeModel,
        this.props.activeSystem
      );
    });
  }

  getAllSystems() {
    return fetch(
      process.env.REACT_APP_API +
        "/hypermedia/network/" +
        this.props.activeModelId +
        "/allsystems"
    )
      .then(res => res.json())
      .then(response => {
        this.setState({ systems: response });
      })
      .catch(error => console.log(error));
  }

  //create Sub System
  createSubSystem() {
    if (this.state.subsystemName) {
      fetch(
        process.env.REACT_APP_API +
          `/hypermedia/network/${this.props.activeModelId}/system/${this.props.activeSystem}/system`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      )
        .then(response => response.json())
        .then(responseJson => {
          return fetch(
            process.env.REACT_APP_API +
              `/hypermedia/network/${this.props.activeModelId}/system/` +
              responseJson.id,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: this.state.subsystemName })
            }
          ).then(response => {
            this.setState({ subsystemName: "" });
            this.props.getSystems(this.props.activeModelId);
            this.props.getSystemDetails(
              this.props.activeModel,
              this.props.activeSystem
            );
          });
        });
    }
  }

  //create service
  createService(event) {
    if (this.state.serviceName) {
      fetch(
        process.env.REACT_APP_API +
          `/model/${this.props.activeModelId}/system/${this.props.activeSystem}/service`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      )
        .then(response => response.json())
        .then(responseJson => {
          return fetch(
            process.env.REACT_APP_API +
              `/model/${this.props.activeModelId}/service/` +
              responseJson.id,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: this.state.serviceName })
            }
          ).then(response => {
            this.setState({ serviceName: "" });
            this.props.getSystems(this.props.activeModelId);
            this.props.getSystemDetails(
              this.props.activeModel,
              this.props.activeSystem
            );
          });
        });
    }
  }

  //create reference
  createReference(event) {
    let value = event.target.value;
    if (
      (event.key === "Enter" || event.type === "blur") &&
      value &&
      this.state.serviceId
    ) {
      event.target.value = "";
      fetch(
        process.env.REACT_APP_API +
          `${this.props.activeModel}/system/${this.props.activeSystem}/reference/${this.state.serviceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name: value })
        }
      )
        .then(response => response.json())
        .then(responseJson => {
          return fetch(
            process.env.REACT_APP_API +
              `${this.props.activeModel}/reference/` +
              responseJson.id,

            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ name: value })
            }
          ).then(response => {
            this.props.getSystems(this.props.activeModelId);
            this.props.getSystemDetails(
              this.props.activeModel,
              this.props.activeSystem
            );
            this.getAllSystems();
          });
        });
    }
  }

  //Delete sub system
  getSubSystemId(Uri, type) {
    let splitArray = Uri.split("/");
    if (splitArray.length > 0) {
      this.deleteEntity(splitArray[4]);
    }
  }

  //Delete entity
  deleteEntity(id) {
    return fetch(
      process.env.REACT_APP_API +
        `/model/${this.props.activeModelId}/modeled/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      }
    ).then(response => {
      this.props.getSystems(this.props.activeModelId);
      this.props.getSystemDetails(
        this.props.activeModel,
        this.props.activeSystem
      );
    });
  }
  //get systems and services list for adding new reference
  getSystemService(event) {
    let parents = this.state.systems;
    let parent = parents.filter(parent => parent.name === event.target.value);
    if (parent) this.setState({ servicesList: parent[0].services });
  }
  handleChange(event) {
    const { formData } = this.state;
    formData[event.target.name] = event.target.value;
    this.setState({
      formData
    });
  }

  serviceHandleChange(event) {
    this.setState({ serviceId: event.target.value });
  }

  addHandleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  toggle = target => {
    this.setState({
      ...this.state,
      [target]: !this.state[target]
    });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.activeSystem !== nextProps.activeSystem)
      this.props.getSystemDetails(
        this.props.activeModel,
        nextProps.activeSystem
      );
  }

  componentWillMount() {
    this.props.getSystemDetails(
      this.props.activeModel,
      this.props.activeSystem
    );
    this.getAllSystems();
  }

  updateSystem() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
    fetch(
      process.env.REACT_APP_API +
        `/hypermedia/network/${this.props.activeModelId}/system/` +
        this.props.systemDetails.id,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.state.formData)
      }
    )
      .then(response =>
        this.props.getSystemDetails(
          this.props.activeModel,
          this.props.systemDetails.id
        )
      )
      .catch(error => console.log(error));
  }

  toggleDescription() {
    this.setState(state => ({ collapse: !state.collapse }));
  }

  //Closes the system details section
  close(menu, type) {
    this.props.close(menu, type);
  }

  //control right click modal
  modalToggle(e, data) {
    this.setState({
      formData: {
        name: this.props.systemDetails.name,
        description: this.props.systemDetails.description
      }
    });
    this.setState(prevState => ({
      modal: !prevState.modal
    }));

    if (data) {
      this.setState({
        details: { description: data.description }
      });
    }
  }

  render() {
    var { formData, systems } = this.state;
    return (
      <div className="org_browser">
        <Modal
          isOpen={this.state.modal}
          toggle={this.modalToggle}
          className="modal-dialog-centered"
        >
          <ModalBody>
            <div className="browser_wrapper system-full-edit">
              <div className="row">
                <div className="org-selector col-md-12">
                  <h4
                    className="text-white text-left float-left"
                    style={{ marginBottom: "35px" }}
                  >
                    Edit System Details
                  </h4>
                  <button
                    className="btn grey-btn done-btn float-right"
                    onClick={this.updateSystem.bind(this)}
                  >
                    <i className="fas fa-check-circle"></i> Done
                  </button>
                </div>
              </div>
              <div className="ob-block row">
                <div className="col-md-8 m-b-20">
                  <p className="text-white text-left">
                    <span id="system-detail-name">
                      <Label for="name">Name</Label>
                      <Input
                        type="text"
                        name="name"
                        className="text-input"
                        value={formData.name}
                        onChange={this.handleChange}
                      />
                    </span>
                  </p>

                  <p className="text-white" style={{ marginTop: 25 }}>
                    <Label for="name">Description</Label>
                    <Input
                      type="text"
                      name="description"
                      className="text-input"
                      value={formData.description || ""}
                      onChange={this.handleChange}
                    />
                  </p>
                </div>
              </div>
              <div className="ob-block row mb-3">
                <div className="col-md-8">
                  <div className="text-white text-left mb-2">
                    <h5 className="text-title">
                      Sub systems
                      {!this.state.systemAdd && (
                        <i
                          className="fas fa-plus system-down-icon round-button"
                          id="system"
                          onClick={e => {
                            this.addUiToggle(e, "system");
                          }}
                        />
                      )}
                    </h5>
                    {this.state.systemAdd && (
                      <div className="d-flex">
                        <div className="bullet-line green-bullet extra-add">
                          <input
                            className="text-input form-control text-grey adding-text"
                            type="text"
                            id="system"
                            ref={this.systemInput}
                            name="subsystemName"
                            value={this.state.subsystemName}
                            onChange={this.addHandleChange.bind(this)}
                          />
                        </div>
                        <div
                          className="round-button"
                          onClick={e => {
                            this.addUiToggle(e, "system");
                          }}
                        >
                          <i
                            className="fas fa-check"
                            onClick={this.createSubSystem.bind(this)}
                          ></i>
                        </div>
                      </div>
                    )}
                  </div>

                  {this.props.systemDetails.subsystemLinks
                    ? this.props.systemDetails.subsystemLinks.map(
                        (subsystem, i) => {
                          return (
                            <div key={i} className="text-white text-left mb-2">
                              <div className="d-flex">
                                <div className="bullet-line text-grey green-bullet">
                                  {!this.state[`subsystem-${i}`] && (
                                    <span>{subsystem.title}</span>
                                  )}

                                  {this.state[`subsystem-${i}`] && (
                                    <>
                                      <input
                                        className="text-input form-control text-grey adding-text"
                                        type="text"
                                        id="system"
                                        onChange={this.editFieldChange.bind(
                                          this,
                                          i,
                                          "subsystem"
                                        )}
                                        value={
                                          this.state[`subsystem-value-${i}`]
                                        }
                                      />
                                    </>
                                  )}
                                </div>

                                {this.state[`subsystem-${i}`] && (
                                  <span className="action-button">
                                    <i
                                      className="fas fa-check"
                                      onClick={this.updateEntity.bind(
                                        this,
                                        i,
                                        subsystem.uri,
                                        "system"
                                      )}
                                    ></i>
                                  </span>
                                )}
                                {!this.state[`subsystem-${i}`] && (
                                  <>
                                    <span className="action-button">
                                      <i
                                        className="fas fa-pencil-alt"
                                        onClick={this.editfield.bind(
                                          this,
                                          i,
                                          subsystem.title,
                                          "subsystem"
                                        )}
                                      ></i>
                                    </span>
                                    <span className="action-button">
                                      <i
                                        className="fas fa-trash-alt"
                                        onClick={this.getSubSystemId.bind(
                                          this,
                                          subsystem.uri
                                        )}
                                      ></i>
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )
                    : ""}
                </div>
              </div>
              <div className="ob-block row mb-3">
                <div className="col-md-8">
                  <div className="text-white text-left mb-2">
                    <h5 className="text-title">
                      Services
                      {!this.state.serviceAdd && (
                        <i
                          className="fas fa-plus system-down-icon round-button"
                          id="system"
                          onClick={e => {
                            this.addUiToggle(e, "service");
                          }}
                        />
                      )}
                    </h5>
                    {this.state.serviceAdd && (
                      <div className="d-flex">
                        <div className="bullet-line blue-bullet extra-add">
                          <input
                            className="text-input form-control text-grey adding-text"
                            type="text"
                            id="system"
                            ref={this.serviceInput}
                            name="serviceName"
                            onChange={this.addHandleChange.bind(this)}
                          />
                        </div>
                        <div
                          className="round-button"
                          onClick={e => {
                            this.addUiToggle(e, "service");
                          }}
                        >
                          <i
                            className="fas fa-check"
                            onClick={this.createService.bind(this)}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {this.props.systemDetails.services
                    ? this.props.systemDetails.services.map((service, i) => {
                        return (
                          <div className="text-white text-left mb-2" key={i}>
                            <div className="d-flex">
                              <div className="bullet-line text-grey green-bullet">
                                {!this.state[`service-${i}`] && (
                                  <span>{service.name}</span>
                                )}

                                {this.state[`service-${i}`] && (
                                  <>
                                    <input
                                      className="text-input form-control text-grey adding-text"
                                      type="text"
                                      id="service"
                                      onChange={this.editFieldChange.bind(
                                        this,
                                        i,
                                        "service"
                                      )}
                                      value={this.state[`service-value-${i}`]}
                                    />
                                  </>
                                )}
                              </div>
                              {this.state[`service-${i}`] && (
                                <span className="action-button">
                                  <i
                                    className="fas fa-check"
                                    onClick={this.updateEntity.bind(
                                      this,
                                      i,
                                      service.id,
                                      "service"
                                    )}
                                  ></i>
                                </span>
                              )}

                              {!this.state[`service-${i}`] && (
                                <>
                                  <span className="action-button">
                                    <i
                                      className="fas fa-pencil-alt"
                                      onClick={this.editfield.bind(
                                        this,
                                        i,
                                        service.name,
                                        "service"
                                      )}
                                    ></i>
                                  </span>
                                  <span className="action-button">
                                    <i
                                      className="fas fa-trash-alt"
                                      onClick={this.deleteEntity.bind(
                                        this,
                                        service.id
                                      )}
                                    ></i>
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })
                    : ""}
                </div>
              </div>
              <div className="ob-block row mb-3">
                <div className="col-md-12">
                  <h5 className="text-title">
                    References
                    {!this.state.referenceAdd && (
                      <i
                        className="fas fa-plus system-down-icon round-button"
                        id="system"
                        onClick={e => {
                          this.addUiToggle(e, "reference");
                        }}
                      />
                    )}
                  </h5>

                  {this.state.referenceAdd && (
                    <div className="no-bullet extra-add mb-3">
                      <div className="text-grey">Create new reference</div>

                      <div className="d-flex">
                        <div className="mr-2">
                          <Input
                            className="text-input no-border"
                            type="select"
                            name="select"
                            onChange={this.getSystemService.bind(this)}
                          >
                            <option>Systems</option>
                            {this.state.systems
                              ? systems.map((system, i) => {
                                  return (
                                    <option
                                      key={i}
                                      value={system.name}
                                      id={system.id}
                                    >
                                      {system.name}
                                    </option>
                                  );
                                })
                              : ""}
                          </Input>
                        </div>
                        <div className="mr-2">
                          <Input
                            className="text-input no-border"
                            type="select"
                            name="select"
                            id="exampleSelect"
                            onChange={this.serviceHandleChange.bind(this)}
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
                        </div>
                        <div className="mr-2">
                          <Input
                            className="text-input mt-0 no-border"
                            type="text"
                            name="text"
                            id="example"
                            placeholder="Add New Reference"
                            onBlur={this.createReference.bind(this)}
                            onKeyDown={this.createReference.bind(this)}
                          />
                        </div>
                        <div>
                          <div
                            className="round-button mt-2"
                            onClick={e => {
                              this.addUiToggle(e, "reference");
                            }}
                          >
                            <i className="fas fa-check" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-md-8">
                  {this.props.systemDetails.references
                    ? this.props.systemDetails.references.map(
                        (reference, i) => {
                          return (
                            <div className="text-white text-left mb-2" key={i}>
                              <div className="d-flex">
                                <div className="bullet-line text-grey arrow-bullet">
                                  {!this.state[`reference-${i}`] && (
                                    <span>{reference.name}</span>
                                  )}

                                  {this.state[`reference-${i}`] && (
                                    <>
                                      <input
                                        className="text-input form-control text-grey adding-text"
                                        type="text"
                                        id="service"
                                        onChange={this.editFieldChange.bind(
                                          this,
                                          i,
                                          "reference"
                                        )}
                                        value={
                                          this.state[`reference-value-${i}`]
                                        }
                                      />
                                    </>
                                  )}
                                </div>
                                {this.state[`reference-${i}`] && (
                                  <span className="action-button">
                                    <i
                                      className="fas fa-check"
                                      onClick={this.updateEntity.bind(
                                        this,
                                        i,
                                        reference.id,
                                        "reference"
                                      )}
                                    ></i>
                                  </span>
                                )}

                                {!this.state[`reference-${i}`] && (
                                  <>
                                    <span className="action-button">
                                      <i
                                        className="fas fa-pencil-alt"
                                        onClick={this.editfield.bind(
                                          this,
                                          i,
                                          reference.name,
                                          "reference"
                                        )}
                                      ></i>
                                    </span>
                                    <span className="action-button">
                                      <i
                                        className="fas fa-trash-alt"
                                        onClick={this.deleteEntity.bind(
                                          this,
                                          reference.id
                                        )}
                                      ></i>
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )
                    : ""}
                </div>
              </div>
            </div>
          </ModalBody>
        </Modal>

        <h3 className="text-white">
          <i
            className="fas fa-user-cog"
            style={{ fontSize: "20px", marginRight: "15px" }}
          ></i>
          System Details
          <img
            src={closeIcon}
            alt="starlify"
            className="system-down-icon browser_close"
            onClick={() => this.close("systemDetail", "menuDetail")}
          />
          <img
            src={edit}
            alt="starlify"
            className="edit"
            onClick={() => this.modalToggle(this, this.props.systemDetails)}
            style={{ marginLeft: "15px", marginTop: "-3px" }}
          />
        </h3>

        <VerticalScrollbars autoHide>
          <div className="browser_wrapper">
            <div className="ob-block row">
              <div className="col-md-8 m-b-20">
                <h5 className="text-left text-grey m-b-0 text-title">Name</h5>
                <p className="text-white text-left">
                  <span id="system-detail-name">
                    {this.props.systemDetails.name}
                  </span>
                </p>
              </div>
              <div className="col-md-4 m-b-20"></div>
              <div className="systemDetailsDisc">
                <h5 className="text-left text-grey m-b-0 text-title">
                  Description
                </h5>
                <p className="text-white">
                  {this.props.systemDetails.description
                    ? this.props.systemDetails.description
                    : "No Description"}
                </p>
              </div>
            </div>

            <div className="ob-block row">
              <h5 className="text-left text-grey m-b-0 text-title col-md-12">
                Sub systems
              </h5>
              {this.props.systemDetails.subsystemLinks
                ? this.props.systemDetails.subsystemLinks.map(
                    (subsystem, i) => {
                      return (
                        <div key={i} className="d-flex w-100">
                          <div className="col-md-12">
                            <p className="text-white text-left">
                              <span className="subsystemCircle"></span>
                              <span>{subsystem.title}</span>
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )
                : ""}
            </div>
            <div className="ob-block row">
              <h5 className="text-left text-grey m-b-0 text-title col-md-12">
                Services
              </h5>
              {this.props.systemDetails.services
                ? this.props.systemDetails.services.map((services, i) => {
                    return (
                      <div key={services.id} className="d-flex w-100">
                        <div className="col-md-12">
                          <p className="text-white text-left">
                            <span className="serviceCircle" />

                            <span id={`service-${i}`}>{services.name}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
            <div className="ob-block row">
              <h5 className="text-left text-grey m-b-0 text-title col-md-12">
                References
              </h5>
              {this.props.systemDetails.references
                ? this.props.systemDetails.references.map((references, i) => {
                    return (
                      <div key={i} className="d-flex w-100">
                        <div className="col-md-12">
                          <p className="text-white text-left">
                            <span className="referenceArrow">→</span>
                            <span id={`reference-${i}`}>
                              {references.name}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
        </VerticalScrollbars>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getSystemDetails: (modelId, systemId) => {
      dispatch(fetchSystemDetils(modelId, systemId));
    },
    getSystems: modelId => {
      dispatch(fetchModel(modelId));
    }
  };
}

function mapStateToProps(state) {
  return {
    activeSystem: state.model.activeSystem,
    activeModel: state.model.modelUri,
    activeModelId: state.model.modelId,
    systemDetails: state.system.systemDetails,
    type: state.system.type
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SystemDetails);
