import React, { Component } from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import _ from 'underscore';

class Graph extends Component {

  constructor(){
    super();
    this.buildForceGraph = this.buildForceGraph.bind(this);
    this.state = {
      load_graph: false,
      systems: []
    }
  }

  buildForceGraph = (systems) => {
    new Promise(async function(resolve, reject) {
        var items = [];
        items["nodes"] = [];
        items["links"] = [];

        for (let i = 0; i < systems.length; i++) {
          const system = systems[i];
          items["nodes"].push({ "id": system.id, "name": system.name  || "System", "type": "system", "radius": 15 });

          if (system.services){
            for (let j = 0; j < system.services.length; j++) {
              const service = system.services[j];
              items["nodes"].push({ "id": service.id, name: service.name || "Service", "type": "service", "radius": 5 });
              items["links"].push({"source": system.id, "target": service.id, "type": "service"});
            }
          }

          if (system.references){
            for (let x = 0; x < system.references.length; x++) {
              var reference = system.references[x];
              var link = reference._links[0];

              if (link && link.rel === "TO") {
                items["links"].push({"source": system.id, "target": link.params.id, "type": "reference", "id": reference.id});
              }
            }
          }

          if (system.subsystems){
            var subsystems = system.subsystems;
            for (var subkey in subsystems) {
                if (subsystems.hasOwnProperty(subkey)) {
                    for (let x = 0; x < subsystems[subkey].length; x++) {
                      var sub = subsystems[subkey][x];
                      switch (sub.type) {
                        case 'system':
                          items["nodes"].push({ "id": subkey, name: sub.title || "Subsystem", "type": "subsystem", "radius": 10 });
                          items["links"].push({"source": system.id, "target": subkey, "type": "subsystem"});
                        break;

                        case 'service':
                          items["nodes"].push({ "id": sub.params.id, name: sub.title || "Service", "type": "service", "radius": 5 });
                          items["links"].push({"source": subkey, "target": sub.params.id, "type": "service"});
                        break;

                        case 'reference':
                          await fetch( process.env.REACT_APP_API + sub.uri )
                          .then(res => res.json())
                          .then(subrefer => {
                            if (subrefer) {
                              var link = subrefer._links[0];
                              if (link && link.rel === "TO") {
                                items["links"].push({"source": subkey, "target": link.params.id, "type": "reference", "id": subrefer.id});
                              }
                            }
                          });
                        break;
                      }
                    }
                }
            }
          }
        }

        resolve(items);

      }).then(function(items) {

        var centered = false;
        var timer;
        const width = window.innerWidth,
              height = window.innerHeight;

        const zoom = d3.zoom()
          .scaleExtent([0.2, 6])
          .on("zoom", zoomed);

        function zoomed() {
          g.attr('transform', d3.event.transform)
        }

        var parent = d3.select(".forcegraph");
        parent.selectAll("*").remove();
        parent.call(zoom)
        //parent.on("click", center)
        var svg = parent.append("svg")
            .attr("width", width)
            .attr("height", height)
            //.call(zoom)
            .append("g")
            .attr("transform", "translate(0,0)");

          svg.append('defs').append('marker')
            .attr('id', 'service')
            .attr('viewBox', '-5 -5 20 20')
            .attr('refX', 8)
            .attr('refY', 0)
            .attr('orient', 'auto')
            .attr('markerWidth', 25)
            .attr('markerHeight', 25)
            .attr('xoverflow', 'visible')
            .append('svg:path')
            .attr('d', 'M -5 -2 L 0 0 L -5 2 z')
            .attr('fill', '#fff')
            .style('stroke','none');

        const g = svg.append("g");

        // Reset camera, set position to center of screen with no zoom.
        // Necessary if changing model after zoom or pan have been made in previosly shown model.
        parent.call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1))

        var simulation = d3.forceSimulation()
          .force("link", d3.forceLink().id(d => d.id)
            .distance(d => d.type === "reference" ? 100 : 10))
          .force("charge", d3.forceManyBody().strength(-250 ))
          .force('gravity', d3.forceRadial(0, 0))
          .force('x', d3.forceX().strength(0.01))
          .force('y', d3.forceY().strength(0.01))
          .force('collide', d3.forceCollide(0))
          .force("center", d3.forceCenter(width / 2, height / 2));

        var links = g.selectAll(".link")
          .data(items.links)
          .enter().append("line")
          .attr("class", "link");

        var nodes = g.selectAll(".node")
          .data(items.nodes)
          .enter().append("g")
          .attr("class", "node")
          //.on("click", d => clicked(d))
          .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
          );

        var circle = nodes.append("circle")
          .attr("class", d => d.type);

        var label = nodes.append("text")
          .attr("dy", ".35em")
          .attr("class", d => d.type + "_label")
          .text(d => d.name);

        simulation
          .nodes(items.nodes)
          .on("tick", tick)
          .on("end", () => {
            if (!centered && items.nodes.length) {
              centered = true;
              center();
            }
          });

        simulation
          .force("link")
          .links(items.links);

        function tick() {
          if (!timer && items.nodes.length) {
            timer = performance.now()
          }
          else if (timer && (performance.now() - timer) > 4000 && !centered){
            centered = true;
            center();
          }

          links
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; })
            .attr("marker-end", function(d) {
              return d.type === "reference" ? "url(#service)" : "";
            })
            .attr("id", function(d) { return "link_"+d.id; })
            .attr("class", function(d) { return "link "+d.type; });

          circle
            .attr("id", function(d) { return "graph_"+d.id; })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("class", function(d) { return d.type; })
            .attr("r", d => d.radius);

          label
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });
        }

        function center() {
          var t = getGraphCenter()
          var identity = d3.zoomIdentity.translate(width / 2, height / 2).scale(t.k).translate(-t.x, -t.y)
          parent.transition().duration(2500).call(
            zoom.transform,
            identity
          );
        }

        function getGraphCenter() {
          var nodes = d3.selectAll('circle').data()
          var range = {
            x: {min: d3.min(_.pluck(nodes, 'x')),
                max: d3.max(_.pluck(nodes, 'x'))},
            y: {min: d3.min(_.pluck(nodes, 'y')),
                max: d3.max(_.pluck(nodes, 'y'))},
            rad: d3.max(_.pluck(nodes, "radius"))
          }
          var x = range.x.min + ((range.x.max - range.x.min) / 2)
          var y = range.y.min + ((range.y.max - range.y.min) / 2)
          var target = 0.8;
          var k;
          ((range.x.max - range.x.min)/width) > ((range.y.max - range.y.min)/height) ?
            k = (target/((range.x.max - range.x.min + range.rad*2)/width)) :
            k = (target/((range.y.max - range.y.min + range.rad*2)/height));
          return {x, y, k}
        }

        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }

        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }

      });

  }


  componentDidUpdate(){

    const { systems, type} = this.props;

    switch (type) {

      case "SELECTDOMAIN":
          this.buildForceGraph([]);
      break;
      case "FETCH_MODEL_SUCCESS":
        if(systems !== undefined){
            this.buildForceGraph(systems)
        }else{
          this.buildForceGraph([]);
        }
      break;
      case "FETCH_MODEL_FAILURE":
          this.buildForceGraph([]);
      break;

      case "HIGHLIGHT_SYSTEM":
        var activeSys = document.getElementById("graph_"+this.props.activeSystem)
        if(activeSys !== null){
          let cols = document.querySelectorAll('.system,.subsystem');
          for(let i = 0; i < cols.length; i++) {
            cols[i].style.fill = '';
          }
          activeSys.setAttribute("style", "fill:#e8455c");
        }
      break;

      case "HIGHLIGHT_SERVICE":
        var activeSrvc = document.getElementById("graph_"+this.props.activeService)
        if(activeSrvc !== null){
          let cols = document.getElementsByClassName('service');
          for(let i = 0; i < cols.length; i++) {
            cols[i].style.fill = '';
          }
          activeSrvc.setAttribute("style", "fill:#e8455c");
        }
      break;

      case "HIGHLIGHT_REFERENCE":
        var activeRfrnc = document.getElementById("link_"+this.props.activeReference)
        if(activeRfrnc !== null){
          let cols = document.getElementsByClassName('reference');
          for(let i = 0; i < cols.length; i++) {
            cols[i].style.stroke = '';
          }
          activeRfrnc.setAttribute("style", "stroke:#e8455c");
        }
      break;

      default:
        break;
    }
  }

  render() {
    return (
        <div className="forcegraph"></div>
    )
  }
}

function mapStateToProps(state){
  return{
    activeSystem: state.model.activeSystem,
    activeService: state.model.activeService,
    activeReference: state.model.activeReference,
    modelUri: state.model.modelUri,
    systems: state.model.items,
    status: state.model.status,
    type: state.model.type,
  }
}

export default connect(mapStateToProps)(Graph);
