<template>
  <div id="container" class="container1">
    <div id="graph" class="graph">
      <!-- <svg></svg> -->
    </div>
    <div id="card" class="card1">
      <card :MaxNode='NumNode' :NumLink="NumLink" :Limit = "Limit" @childByValue="childByValue"></card>
    </div>
  </div>
</template>

<script type="text/javascript" src="d3.v5.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.13.0/d3-legend.js"></script>

<script>
import Card from './card.vue';
export default {
  name: 'graph',
  data(){
    return {
      NumNode: Number,
      NumLink: Number,
      Limit: Number,
    }
  },
  components:{
    Card
  },
  mounted() {
    this.draw()
  },
  methods: {
    childByValue: function (childValue) {
      // childValue就是子组件传过来的值
      this.Limit = Number(childValue)
      this.draw()
    },
    draw: function() {
      Promise.all([
        d3.dsv(",", "all_edges.csv"),
        d3.dsv(",", "school_totals.csv")
      ]).then(files => {
        var data = files[0]
        var clicked = false
        //node size: based on publishing count per school
        var counts = files[1];
        let countMap = new Map();
        let Cmax = 0
        counts.forEach(Element => {
          countMap.set(Element["institution"], Element["sum(count)"])
          if (Element["sum(count)"] > Cmax){
            Cmax = Element["sum(count)"]
          }
        })
        //Node degree
        let Dmap = new Map();
        data.forEach(Element => {
          if (Dmap.has(Element["source"])) {
            Dmap.set(Element["source"], Dmap.get(Element["source"]) + 1);
          } else {
            Dmap.set(Element["source"], 1);
          }
          if (Dmap.has(Element["target"])) {
            Dmap.set(Element["target"], Dmap.get(Element["target"]) + 1);
          } else {
            Dmap.set(Element["target"], 1);
          }
        })
        let Dmax = 0;
        Dmap.forEach(value => {
          if (value > Dmax) {
            Dmax = value;
          }
        })
        let LimitNode = Array.from(Dmap);
        this.NumNode = LimitNode.length;
        if(isNaN(this.Limit)) this.Limit = this.NumNode;
        LimitNode.sort((a, b) => a[1] > b[1] ? -1 : 1)
        LimitNode = LimitNode.slice(0, this.Limit);
        Dmap = new Map(LimitNode.map(function (i) {
          return [i[0], i[1]];
        }));
        // edge
        var links = data;
        let renderNode = {}
        var renderLink = [];
        // compute the distinct nodes from the links.
        links.forEach(function (link) {
          //nodes[link.source]不存在 => nodes[link.source] = {name: link.source}
          if (Dmap.has(link["source"]) && Dmap.has(link["target"])) {
            let source = renderNode[link["source"]] || (renderNode[link["source"]] = {name: link["source"]});
            let target = renderNode[link["target"]] || (renderNode[link["target"]] = {name: link["target"]});
            let value = link["value"]
            renderLink.push({source, target, value})
          }
        });
        this.NumLink = renderLink.length;
        //draw graph
        var width = 1200,
            height = 750;
        var force = d3.forceSimulation()
            .nodes(d3.values(renderNode))
            .force("link", d3.forceLink(renderLink).distance(100))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .force("charge", d3.forceManyBody().strength(-250))
            .alphaTarget(1)
            .on("tick", tick);
        var parent = document.getElementById('graph');
        if (parent.children[0]) {
          parent.removeChild(parent.children[0]);
        }
        var svg = d3.select("#graph")
            .append("svg")
            .attr("id", "svgId")
            .attr("width", width)
            .attr("height", height)
            .call(d3.zoom().on("zoom", function () {
              svg.attr("transform", d3.event.transform)
            }));
        d3.select("svg").on("dblclick.zoom", null);
        // add the links
        var path = svg.append("g")
            .selectAll("path")
            .data(renderLink)
            .enter()
            .append("path")
            .attr("class", function (d) {
              return "link ";
            })
            .style("stroke", function (d) {
              return "gray";
            })
            .style("stroke-width", function (d) {
              return "" + String(d.value / 70 + 0.1) + "px"
            })
            .style("stroke-dasharray", function (d) {
              return "1 0";
            });
        // define the nodes
        var node = svg.selectAll(".node")
            .data(force.nodes())
            .enter().append("g")
            .attr("class", "node")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
            .on("dblclick", activate)
        //linear Scale
        var linearSize = d3.scaleLinear().domain([0, Cmax * 2]).range([3, 10]);
        var colorScale = d3.scaleQuantile().domain([0, Dmax])
            .range(["lightsalmon", "salmon", "indianred", "firebrick"]);
        // add the nodes
        node.append("circle")
            .attr("id", function (d) {
              return (d.name.replace(/\s+/g, '').toLowerCase());
            })
            .attr("r", function (d) {
              return linearSize(countMap.get(d.name))
            })
            .attr("fill", function (d) {
              return colorScale(Dmap.get(d.name))
            })
        //Adding node labelss
        node.append("text")
            .attr("text-anchor", "middle")
            // .attr("dx", function(d){
            //   return linearSize(countMap.get(d.name))
            // })
            .attr("dy", ".35em")
            .text(function (d) {
              return d.name;
            });
        // add the curvy lines
        function tick() {
          path.attr("d", function (d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" +
                d.source.x + "," +
                d.source.y + "A" +
                dr + "," + dr + " 0 0,1 " +
                d.target.x + "," +
                d.target.y;
          });
          node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
          });
        }
        // select the svg area
        var Svg = d3.select("svg")
        //var linearSize = d3.scaleLinear().domain([0,Dmax]).range([5, 10]);
        // create a list of keys
        var keys = [16000, 4000, 1000, 500]
        // Usually you have a color scale in your chart already
        var color = d3.scaleOrdinal()
            .domain(keys)
            .range(d3.schemeSet2);
        // Add one dot in the legend for each name.
        var legendNodes = Svg.selectAll("mydots").data(keys).enter()
        legendNodes.append("circle")
            .attr("cx", function (d, i) {
              return 850 + 100 * i
            })
            .attr("cy", 650)
            .attr("r", function (d) {
              return linearSize(d)
            })
            .style("fill", function (d) {
              return colorScale(d)
            })
        // Add one dot in the legend for each name.
        legendNodes.append("text")
            .attr("x", function (d, i) {
              return 850 + 100 * i
            })
            .attr("y", 690)
            .text(function (d) {
              return d
            })
            .attr("text-anchor", "middle")
            .style("font-size", "15px")
        Svg.append("text")
            .attr("x", 985).attr("y", 600).text("Paper Count")
        var adjacent = new Set()
        var selected = new Map()
        function activate(d){
          if (!selected.has(d.name) || selected.get(d.name) == false) {
            d3.select(this).select("circle").transition()
                .duration(0)
                .style("fill", "lightblue")
            selected.set(d.name, true)
            renderLink.forEach(function (link){
              if(link.source.name == d.name){
                adjacent.add(link.target.name)
              } else if (link.target.name == d.name) {
                adjacent.add(link.source.name)
              }
            })
            adjacent.add(d.name)
            if (!d3.event.active) force.alphaTarget(0);
            if (d.fixed == true) {
              d.fx = d.x;
              d.fy = d.y;
            } else {
              d.fx = d.x;
              d.fy = d.y;
            }
            clicked = true
            node.selectAll("circle")
                .style("visibility", function (circle) {
                  return adjacent.has(circle.name) ? "visible": "hidden";
                })
            d3.selectAll("path")
                .style("visibility", function (edge) {
                  return adjacent.has(edge.source.name) && adjacent.has(edge.target.name) ? "visible": "hidden";
                  // return (selected.has(edge.source.name) && selected.get(edge.source.name)) ||
                  // (selected.has(edge.source.name) && selected.get(edge.source.name)) ? "visible" : "hidden";
                })
            node.selectAll("text")
                .style("visibility", function (text) {
                  return adjacent.has(text.name) ? "visible": "hidden";
                })
          } else {
            adjacent.clear()
            selected.clear()
            node.selectAll("circle")
                .style("visibility", "visible")
            d3.selectAll("path")
                .style("visibility", "visible")
            node.selectAll("text")
                .style("visibility", "visible")
            d3.selectAll("circle").transition()
                .duration(1000)
                .style("fill", function (d) {
                  if(!Dmap.has(d.name)){
                    return colorScale(d)
                  }
                  return colorScale(Dmap.get(d.name))
                });
            delete d.fx;
            delete d.fy;
            d3.select(this).classed("fixed", false);
            force.alpha(0.3).restart();
          }}
        function dragstarted(d) {
          d.fixed = true;
          if (!d3.event.active) force.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }
        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }
        function dragended(d) {
          if (!d3.event.active) force.alphaTarget(0);
          if (d.fixed == true) {
            d.fx = d.x;
            d.fy = d.y;
          } else {
            d.fx = d.x;
            d.fy = d.y;
          }
        }
      })
    }
  }
}
</script>


<style>
.legendSize{
  color:aqua
}
path.link {
  fill: none;
  stroke: gray;
  stroke-width: 2.5px;
}
path.link {
  fill: none;
  stroke: green;
  stroke-width: 1.5px;
  stroke-dasharray:10
}
circle {
  stroke: #fff;
  stroke: black;
  stroke-width: 1.5px;
}
text {
  fill: #000;
  font: 10px sans-serif;
  pointer-events: none;
}
.name {
  fill: #000;
  font: 20px sans-serif;
  pointer-events: none;
}
.card1{
  margin-top: 20px;
  margin-right: 20px;
  float: right;
  width: 300px;
  background: #000;
}
.graph{
  float:left;
  width: 800px;
}
.container1{
  overflow:hidden;
  /* background: grey; */
}
</style>