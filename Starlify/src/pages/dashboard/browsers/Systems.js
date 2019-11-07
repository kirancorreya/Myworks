import React, { Component } from "react";
import {
    Collapse, Input, Row,
    Col,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from "reactstrap";
import VerticalScrollbars from "../../../_assets/Scrollbars/VerticalScrollbars";
import { connect } from 'react-redux';
import { fetchModel } from '../../../store/model/modelActions'
import { fetchFlows, fetchSystemDetils, fetchFlowDetils } from '../../../store/system/systemActions'

import closeIcon from "../../../_assets/icons/icons/exitwhite.svg";

class Systems extends Component {
    constructor(props) {
        super(props);

        this.addUiToggle = this.addUiToggle.bind(this);
        this.resetAddUiToggle = this.resetAddUiToggle.bind(this);
        this.systemMenuToggle = this.systemMenuToggle.bind(this);
        this.flowsMenuToggle = this.flowsMenuToggle.bind(this);
        this.systemToggle = this.systemToggle.bind(this);
        this.flowsToggle = this.flowsToggle.bind(this);
        this.subSystemToggle = this.subSystemToggle.bind(this);
        this.close = this.close.bind(this);
        this.menuClick = this.menuClick.bind(this);
        this.modalToggle = this.modalToggle.bind(this);
        this.state = {
            flowAddClass: false,
            systemAddClass: false,
            modal: false,
            flowsCollapse: true,
            systemsCollapse: true,
            currentSystemIndex: "",
            currentSubSystemIndex: "",
            currentFlowIndex: "",
            itemId: '',
            itemName: '',
            itemType: '',
            itemEntity: '',
            systemAdd: false,
            flowAdd: false,
            servicesList: '',
            serviceId: '',
        };

    }


    //manage add more system/flow text box to ui
    addUiToggle(event, type) {
        if (type === 'system') {
            this.setState(state => ({ systemAdd: !state.systemAdd, itemEntity: 'system' }));
        } else {
            this.setState(state => ({ flowAdd: !state.flowAdd, itemEntity: 'flow' }));
        }
    }

    //setting entity while add more systems/flows
    resetAddUiToggle(event, type) {
        if (type === 'system') {
            this.setState(state => ({ itemEntity: 'system' }));
        } else {
            this.setState(state => ({ itemEntity: 'flow' }));
        }

    }

    menuClick(menu, id) {
        if(menu === 'systemDetail'){
            this.props.getSystemDetails(this.props.activeModel, id)
            this.props.onSystemClick(id);
        }
        else {
            this.props.getFlowDetails(this.props.activeModelId, id)
            this.props.onFlowSelect(id);
        }


        setTimeout( () => {
            this.props.close(menu)
            this.props.menuClick(menu)
          }, 1000);

    }
    close(menu, id) {
        this.props.close(menu);
    }

    systemMenuToggle() {
        this.setState(state => ({ systemsCollapse: !state.systemsCollapse, systemAddClass: !this.state.systemAddClass }));
    }
    flowsMenuToggle() {
        this.setState(state => ({ flowsCollapse: !state.flowsCollapse, flowAddClass: !this.state.flowAddClass }));

    }

    flowsToggle(flowId) {
        this.close('flowDetail')
        if (this.state.currentFlowIndex === flowId) {
            this.setState({ currentFlowIndex: 0 })
            flowId = ''
        } else {
            this.setState({ currentFlowIndex: flowId });
        }
        this.props.onFlowSelect(flowId)
    }

    //manage system listing toggle
    systemToggle(systemId) {
        this.close('systemDetail')
        if (this.state.currentSystemIndex === systemId) {
            this.setState({ currentSystemIndex: 0 });
            systemId = '';
        } else {
            this.setState({ currentSystemIndex: systemId });
            //this.props.getSystemDetails(this.props.activeModel, systemId)
        }
        this.props.onSystemClick(systemId);
        //this.props.getSystemDetails(this.props.activeModel, systemId)
    }

    //manage sub system listing toggle
    subSystemToggle(systemId) {
        this.close('systemDetail')
        if (this.state.currentSubSystemIndex === systemId) {
            this.setState({ currentSubSystemIndex: 0 })
            systemId = '';
        } else {

            this.setState({ currentSubSystemIndex: systemId });
            this.props.getSystemDetails(this.props.activeModel, systemId)
        }
        this.props.onSystemClick(systemId);
    }

    //create entity
    createEntity(event) {
        let value = event.target.value;
        if (event.key === 'Enter') {
            event.target.value = '';
            fetch(
                process.env.REACT_APP_API + `/hypermedia/network/${this.props.activeModelId}/${this.state.itemEntity}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
                .then(response => response.json())
                .then(responseJson => {
                    return fetch(
                        process.env.REACT_APP_API + `/hypermedia/network/${this.props.activeModelId}/${this.state.itemEntity}/` + responseJson.id,
                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ name: value })
                        }
                    )
                        .then(response => {
                            this.state.itemEntity === 'flow' ? this.props.getFlows(this.props.activeModelId) : this.props.getSystems(this.props.activeModelId)
                        })

                });
        }
    }


    //create service
    createService(event) {
        let value = event.target.value;
        if ((event.key === 'Enter' || event.type === 'blur') && value) {
            event.target.value = '';
            this.setState(prevState => ({
                modal: !prevState.modal
            }));

            fetch(
                process.env.REACT_APP_API + `${this.props.activeModel}/system/${this.state.itemId}/service`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
                .then(response => response.json())
                .then(responseJson => {
                    return fetch(
                        process.env.REACT_APP_API + `${this.props.activeModel}/service/` + responseJson.id,

                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ name: value })
                        }
                    )
                        .then(response => {
                            this.props.getSystems(this.props.activeModelId)
                            this.props.getSystemDetails(this.props.activeModel, this.props.activeSystem)
                        }

                        )
                });
        }
    }

    //create reference
    createReference(event) {
        let value = event.target.value;
        if ((event.key === 'Enter' || event.type === 'blur') && value && this.state.serviceId) {
            event.target.value = '';
            this.setState(prevState => ({
                modal: !prevState.modal
            }));

            fetch(
                process.env.REACT_APP_API + `${this.props.activeModel}/system/${this.state.itemId}/reference/${this.state.serviceId}`,
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
                        process.env.REACT_APP_API + `${this.props.activeModel}/reference/` + responseJson.id,

                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ name: value })
                        }
                    )
                        .then(response => {
                            this.props.getSystems(this.props.activeModelId)
                            this.props.getSystemDetails(this.props.activeModel, this.state.itemId)
                        }
                        )
                });
        }
    }


    //create entity
    createSubSystem(event) {
        let value = event.target.value;
        if ((event.key === 'Enter' || event.type === 'blur') && value) {
            event.target.value = '';
            this.setState(prevState => ({
                modal: !prevState.modal
            }));
            fetch(
                process.env.REACT_APP_API + `${this.props.activeModel}/${this.state.itemEntity}/${this.state.itemId}/${this.state.itemEntity}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
                .then(response => response.json())
                .then(responseJson => {
                    return fetch(
                        process.env.REACT_APP_API + `${this.props.activeModel}/${this.state.itemEntity}/` + responseJson.id,
                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ name: value })
                        }
                    )
                        .then(response => {
                            this.props.getSystems(this.props.activeModelId)
                            this.props.getSystemDetails(this.props.activeModel, this.state.itemId)
                        }
                        )
                });
        }
    }

    //Delete entity
    deleteEntity() {
        if (this.state.itemEntity === 'system' && (this.state.item.services.length > 0 || this.state.item.references.length > 0)) {
            this.setState(prevState => ({
                modal: !prevState.modal
            }));
            this.setState({ itemType: 'deleteFailed' })
            this.setState({ modal: true })
        } else {
            return fetch(
                process.env.REACT_APP_API + `/hypermedia/network/${this.props.activeModelId}/${this.state.itemEntity === 'flow' ? 'flow' : 'modeled'}/${this.state.itemId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
                .then(response => {
                    this.setState(prevState => ({
                        modal: !prevState.modal
                    }));
                    this.state.itemEntity === 'flow' ? this.props.getFlows(this.props.activeModelId) : this.props.getSystems(this.props.activeModelId)
                    if (this.state.itemEntity === 'system')
                        this.props.getSystemDetails(this.props.activeModel, this.state.itemId)
                    else if (this.state.itemEntity === 'subsystem')
                        this.props.getSystemDetails(this.props.activeModel, this.props.activeSystem)
                });
        }
    }

    //update item value for edit
    renameHandleChange = (e) => {
        this.setState({ itemName: e.target.value });
    }

    //Update entity
    updateEntity(event) {
        let value = event.target.value;
        if ((event.key === 'Enter' || event.type === 'blur') && this.state.modal && value) {
            event.target.value = '';
            this.setState(prevState => ({
                modal: !prevState.modal
            }));
            fetch(
                process.env.REACT_APP_API + `/hypermedia/network/${this.props.activeModelId}/${this.state.itemEntity === 'subsystem' ? 'system' : this.state.itemEntity}/` + this.state.itemId,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name: value })
                }
            )
                .then(response => {
                    console.log(this.state.itemEntity)
                    this.state.itemEntity === 'flow' ? this.props.getFlows(this.props.activeModelId) : this.props.getSystems(this.props.activeModelId)
                    /*if (this.state.itemEntity === 'flow')
                        this.props.getFlowDetails(this.props.activeModel, this.state.itemId)
                    else
                        this.props.getSystemDetails(this.props.activeModel, this.props.activeSystem)*/
                }
                )
        }

    }


    //control right click modal
    modalToggle(e, data) {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));

        if (data) {
            this.setState({
                item: data.item,
                itemId: data.itemId,
                itemName: data.itemName,
                itemType: data.itemType,
                itemEntity: data.itemEntity
            })

        }
    }

    //get systems and services list for adding new reference
    getSystems(event) {
        let parents = this.props.systems;
        let parent = parents.filter(parent => parent.name === event.target.value);
        if (parent)
            this.setState({ servicesList: parent[0].services });
    }

    serviceChangeHandle(event) {
        this.setState({ serviceId: event.target.value })
    }


    render() {
        let flowBoxClass = ["org-height-50"];
        if (this.state.flowAddClass) {
            flowBoxClass.push('fullheight');
        }
        let systemBoxClass = ["org-height-50"];
        if (this.state.systemAddClass) {
            systemBoxClass.push('fullheight');
        }
        return (
            <div className="org_browser" >

                <h3 className="text-white">
                    <i className="fas fa-sitemap" style={{fontSize:"20px", marginRight:"15px"}}></i>Systems and Flows

        
                    <img
            src={closeIcon}
            alt="starlify"
            className="system-down-icon browser_close"
            onClick={() => this.close('system', 'menu')}
          />
                </h3>

                {/* <div className="_search border" id="searchControl">
                                <input
                                    type="text"
                                    className="search-input"
                                    onKeyUp={this.searchSystem} />
                                <span className="icon icon-Search search-icon" />
                            </div> */}

                <Row className="searchbar">
                    <Col sm="8">
                        <InputGroup>
                            <Input placeholder="search" onKeyUp={this.searchSystem} />
                            <InputGroupAddon addonType="append">
                                <InputGroupText>
                                    <i className="fas fa-search"></i>
                                </InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </Col>
                </Row>
                <div className="menu-scroll-wrapper">
                    <VerticalScrollbars autoHide>
                        <div className="browser_wrapper">
                            <div className="org-selector">
                                {/* <p className="text-white text-left">Selector</p> */}

                                <div className="systems w-100 d-inline-block montserrat text-grey">
                                    <div className="system-search montserrat" />

                                    <div
                                        className={`text-white click systemClick ${this.state.systemsCollapse ? 'active ' : ''}`}
                                        style={{ marginBottom: "1rem" }}
                                    >
                                        <span onClick={this.systemMenuToggle}>
                                            Systems
                                            <i className="fas fa-chevron-down system-down-icon" />

                                        </span>
                                        {!this.state.systemAdd && (
                                            <i
                                                className="fas fa-plus system-down-icon round-button"
                                                id="system"

                                                onClick={(e) => {
                                                    this.addUiToggle(e, 'system')
                                                }}
                                            />)}

                                        {this.state.systemAdd && (<div className="extra-add mb-3 mr-0">
                                            <input
                                                className="pr-5"
                                                type="text"
                                                id="system"
                                                onKeyDown={this.createEntity.bind(this)}
                                                onFocus={(e) => {
                                                    this.resetAddUiToggle(e, 'system')
                                                }}
                                            />
                                            <button type="button" onClick={(e) => {
                                                this.addUiToggle(e, 'system')
                                            }}>
                                                <i className="fas fa-times" />
                                            </button>
                                        </div>)}

                                    </div>



                                    <Collapse isOpen={this.state.systemsCollapse} >
                                        {/* <VerticalScrollbars className={flowBoxClass.join(' ')}> */}
                                            {this.props.systems
                                                ? this.props.systems.map((item, index) => {
                                                    return (
                                                        <div key={item.id} className="listingItem">

                                                                <div className="menu-wrapper-row">
                                                                <p
                                                                    className={`text-grey click ${this.props.activeSystem === item.id ? 'active ' : ''}`}
                                                                    onClick={() => this.systemToggle(item.id)}
                                                                    style={{ marginLeft: "1rem" }}
                                                                >

                                                                    <i className={`system-down-icon left text-white ${item.services.length || item.references.length || item.subsystems.length ? 'fas fa-chevron-down' : ''}`} />
                                                                    <span className="systemCircle" />

                                                                    <span
                                                                    >
                                                                        {item.name}
                                                                    </span>

                                                                </p>
                                                                <a href="javascript:void(0);" className="view-details" onClick={() => this.menuClick('systemDetail', item.id)}>
                                                                    <i className="fas fa-list" ></i>
                                                                </a>

                                                                </div>

                                                            <Collapse isOpen={this.state.currentSystemIndex === item.id ? true : false}>
                                                                {item.services
                                                                    ? item.services.map((service, i) => {
                                                                        return (
                                                                            <div id={service.id} key={service.id}>

                                                                                    <p
                                                                                        className={`text-grey click ${this.props.activeService === service.id ? 'active ' : ''}`}
                                                                                        style={{
                                                                                            marginBottom: "1rem",
                                                                                            marginLeft: "5rem"
                                                                                        }}
                                                                                        onClick={this.props.onServiceClick}
                                                                                        id={service.id}
                                                                                    >

                                                                                        <span className="serviceCircle" />
                                                                                        {service.name}
                                                                                    </p>

                                                                            </div>
                                                                        );
                                                                    })
                                                                    : ""}

                                                                {item.references
                                                                    ? item.references.map((referenceData, i) => {
                                                                        return (

                                                                                <p key={referenceData.id}
                                                                                    className={`text-grey click ${this.props.activeReference === referenceData.id ? 'active ' : ''}`}
                                                                                    style={{
                                                                                        marginBottom: "1rem",
                                                                                        marginLeft: "5rem"
                                                                                    }}
                                                                                    onClick={this.props.onReferenceClick}
                                                                                    id={referenceData.id}
                                                                                >
                                                                                    <span className="referenceArrow">→</span>
                                                                                    {referenceData.name}
                                                                                </p>

                                                                        );
                                                                    })
                                                                    : ""}



                                                                {item.subsystems
                                                                    ? item._links
                                                                        .filter(links => links.rel === 'SUBSYSTEM')
                                                                        .map((subsystem, i) => {
                                                                            return (
                                                                                <div key={i} className="relative">

                                                                                        <p
                                                                                            className={`text-grey click ${this.props.activeSystem === subsystem.params.id ? 'active ' : ''}`}
                                                                                            onClick={() =>
                                                                                                this.subSystemToggle(
                                                                                                    subsystem.params.id
                                                                                                )
                                                                                            }
                                                                                            style={{
                                                                                                marginBottom: "1rem",
                                                                                                marginLeft: "3rem"
                                                                                            }}
                                                                                        >
                                                                                            <i className={`system-down-icon left text-white ${item.subsystems[subsystem.params.id].filter(item => item.rel === 'PROVIDES').length || item.subsystems[subsystem.params.id].filter(item => item.rel === 'CONSUMES').length ? 'fas fa-chevron-down' : ''}`} />
                                                                                            <span className="subsystemCircle" />

                                                                                            <span


                                                                                            >
                                                                                                {subsystem.title}
                                                                                            </span>

                                                                                        </p>
                                                                                        <a className="view-details" href="javascript:void(0);">
                                                                    <i className="fas fa-list" onClick={() => this.menuClick('systemDetail', subsystem.params.id)}></i>
                                                                </a>

                                                                                    <Collapse
                                                                                        isOpen={ this.state .currentSubSystemIndex === subsystem.params.id ? true : false }
                                                                                    >
                                                                                        {item.subsystems[subsystem.params.id]
                                                                                            ? item.subsystems[subsystem.params.id]
                                                                                                .filter(item => item.rel === 'PROVIDES')
                                                                                                .map((service, i) => {
                                                                                                    console.log(service);
                                                                                                    return (
                                                                                                        <div key={i} id={service.params.id}>
                                                                                                            <p
                                                                                                                className={`text-grey click ${this.props.activeService === service.params.id ? 'active ' : ''}`}
                                                                                                                onClick={this.props.onServiceClick}
                                                                                                                id={service.params.id}
                                                                                                                style={{
                                                                                                                    marginBottom: "1rem",
                                                                                                                    marginLeft: "7rem"
                                                                                                                }}
                                                                                                            >
                                                                                                                <span className="serviceCircle" />
                                                                                                                {service.title}
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    );
                                                                                                }
                                                                                                )
                                                                                            : ""}
                                                                                        {item.subsystems[subsystem.params.id]
                                                                                            ? item.subsystems[subsystem.params.id]
                                                                                                .filter(item => item.rel === 'CONSUMES')
                                                                                                .map((reference, i) => {
                                                                                                    return (
                                                                                                        <div key={i} id={reference.params.id}>
                                                                                                            <p
                                                                                                              className={`text-grey click ${this.props.activeReference === reference.params.id ? 'active ' : ''}`}
                                                                                                              onClick={this.props.onReferenceClick}
                                                                                                              id={reference.params.id}
                                                                                                              style={{
                                                                                                                  marginBottom: "1rem",
                                                                                                                  marginLeft: "7rem"
                                                                                                              }}
                                                                                                            >
                                                                                                            <span className="referenceArrow">→</span>
                                                                                                            {reference.title}
                                                                                                          </p>
                                                                                                        </div>
                                                                                                    );
                                                                                                }
                                                                                                )
                                                                                            : ""}
                                                                                    </Collapse>
                                                                                </div>
                                                                            );
                                                                        })
                                                                    : ""}

                                                            </Collapse>
                                                        </div>
                                                    );
                                                })
                                                : ""}
                                        {/* </VerticalScrollbars> */}
                                    </Collapse>

                                </div>
                                <div className="flows">
                                    <div
                                        className={`text-white click flowClick ${this.state.flowsCollapse ? 'active ' : ''}`}
                                        style={{ marginBottom: "1rem" }}
                                    >
                                        <span onClick={this.flowsMenuToggle}>
                                            Flows
                                    <i className="fas fa-chevron-down system-down-icon" />

                                        </span>

                                        {!this.state.flowAdd && (<i
                                            className="fas fa-plus system-down-icon round-button"
                                            id="flows"

                                            onClick={(e) => {
                                                this.addUiToggle(e, 'flow')
                                            }}
                                        />)}

                                        {this.state.flowAdd && (<div className="extra-add mb-3 mr-0">
                                            <input
                                                className="pr-5"
                                                type="text"
                                                id="flow"
                                                onKeyDown={this.createEntity.bind(this)}
                                                onFocus={(e) => {
                                                    this.resetAddUiToggle(e, 'flow')
                                                }}
                                            />
                                            <button type="button" onClick={(e) => {
                                                this.addUiToggle(e, 'flow')
                                            }}>
                                                <i className="fas fa-times" />
                                            </button>
                                        </div>)}

                                    </div>


                                    <Collapse isOpen={this.state.flowsCollapse} id="FlowListing">
                                        {/* <VerticalScrollbars className={systemBoxClass.join(' ')}> */}
                                            {this.props.flows
                                                ? this.props.flows.map((item, index) => {
                                                    return (
                                                        <div key={item.id} className="menu-wrapper-row">
                                                            <div className="FlowListingItem">

                                                                <p
                                                                    className={`text-grey click ${this.props.activeFlow === item.id ? 'active ' : ''}`}
                                                                    style={{
                                                                        marginBottom: "1rem",
                                                                        marginLeft: "2rem"
                                                                    }}
                                                                    onClick={() => this.flowsToggle(item.id)}
                                                                >
                                                                    <span
                                                                        id={item.id}

                                                                    >
                                                                        {item.name}
                                                                    </span>



                                                                </p>
                                                                <i className="fas fa-list" onClick={() => this.menuClick('flowDetail', item.id)}></i>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                                : ""}
                                        {/* </VerticalScrollbars> */}
                                    </Collapse>

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
        onSystemClick: (systemId) => {
            const action = { type: "HIGHLIGHT_SYSTEM", system: systemId };
            dispatch(action);
        },
        onServiceClick: (e) => {
            const action = { type: "HIGHLIGHT_SERVICE", service: e.target.id };
            dispatch(action);
        },
        onReferenceClick: (e) => {
            const action = { type: "HIGHLIGHT_REFERENCE", reference: e.target.id };
            dispatch(action);
        },
        onFlowSelect: (flowId) => {
            const action = { type: "FLOW_SELECT", flowId: flowId };
            dispatch(action);

        },
        getSystems: (modelId) => {
            dispatch(fetchModel(modelId));
        },
        getFlows: (modelId) => {
            dispatch(fetchFlows(modelId));
        },
        getSystemDetails: (modelId, systemId) => {
            dispatch(fetchSystemDetils(modelId, systemId));
        },
        getFlowDetails: (modelId, FlowId) => {
            dispatch(fetchFlowDetils(modelId, FlowId));
        }
    }
}

function mapStateToProps(state) {
    return {
        activeSystem: state.model.activeSystem,
        activeFlow: state.system.activeFlow,
        activeService: state.model.activeService,
        activeReference: state.model.activeReference,
        activeModel: state.model.modelUri,
        activeModelId: state.model.modelId,
        systems: state.model.items,
        flows: state.system.flows,
        type: state.system.type,
        invocations: state.system.invocations
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Systems);
