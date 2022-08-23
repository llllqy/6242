<template>
  <div class = "Pie-chart-container">  
    <div class = "center"> 
      <div class = "select">

        <v-select
          v-model="selected"
          :items="institutions"
          label="Solo field"
          solo
        ></v-select>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript" src="d3.v5.min.js"></script>
<script>
  export default {
    name: 'chartbar',

    mounted(){
      this.getInstitution();
      this.getInstitutionDetail()
      this.draw();
    },
    watch: {
      selected(val) {
        this.getInstitutionDetail()
        this.change();
      },
      PieDate(val){
        this.change();
      }
    },
    data(){
      return {
        selected : "Boston University",
        institutions:[],
        PieDate:[{id: 0, institution: 'Boston University', topic: 'Statistical Mechanics', total: 279}
        ,{id: 1, institution: 'Boston University', topic: 'Probability', total: 117}
        ,{id: 2, institution: 'Boston University', topic: 'Physics and Society', total: 84}
        ,{id: 3, institution: 'Boston University', topic: 'High Energy Physics - Theory', total: 62}
        ,{id: 4, institution: 'Boston University', topic: 'Quantum Physics', total: 56}
        ,{id: 5, institution: 'Boston University', topic: 'Information Theory', total: 55}
        ,{id: 6, institution: 'Boston University', topic: 'Optics', total: 53}
        ,{id: 7, institution: 'Boston University', topic: 'High Energy Physics - Phenomenology', total: 47}
        ,{id: 8, institution: 'Boston University', topic: 'Machine Learning', total: 41}
        ,{id: 9, institution: 'Boston University', topic: 'Data Analysis', total:37}],
        svg:{},
      }
    },
    methods: {
      draw: function(){
        var svg = d3.select(".center")
          .append("svg")
          .attr("id","PieSvg")
          .attr("class","PieSvg")
          .append("g")

        svg.append("g")
          .attr("class", "slices");
        svg.append("g")
          .attr("class", "labels");
        svg.append("g")
          .attr("class", "lines");

        var width = 960,
            height = 450,
            radius = Math.min(width, height) / 2;
        svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        this.change();
      },
      change:function() {

        let PieData = JSON.parse(JSON.stringify(this.PieDate)).slice(0, 10)
        let label = [];
        let value = [];
        console.log("pieData",PieData)
        for(let i = 0; i < 10; i++) {
          label.push(PieData[i].topic);
          value.push(PieData[i].total);
        }
        console.log("ad",label,value)
          var svg = d3.select("#PieSvg")

          var width = 960,
            height = 450,
          radius = Math.min(width, height) / 2;

        var pie = d3.pie()
          .sort(null)
          .value(function(d) {
            return d.value;
          });

        var arc = d3.arc()
          .outerRadius(radius * 0.8)
          .innerRadius(radius * 0.4);

        var outerArc = d3.arc()
          .innerRadius(radius * 0.9)
          .outerRadius(radius * 0.9);


        var key = function(d){ return d.data.label; };

        var color = d3.scaleOrdinal()
          .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])
          .range(["#900C3F", "#C70039", "#FF5733", "#FFC300", "#DAF7A6", "#3498DB", "#DB3495"]);

       function randomData (){
          var labels = color.domain();
          for(let i = 0; i < labels.length; i++) {
            console.log("label item", labels[i])
            labels[i] = {"label": labels[i], "value": value[i], "name":label[i]};
          }
          return labels;
        }
        let data = randomData();
        console.log("data",data)
          /* ------- PIE SLICES -------*/
          var slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(data), key);

          slice.enter()
            .insert("path")
            .style("fill", function(d) { return color(d.data.label); })
            .attr("class", "slice");

          slice		
            .transition().duration(1000)
            .attrTween("d", function(d) {
              this._current = this._current || d;
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                return arc(interpolate(t));
              };
            })

          slice.exit()
            .remove();

          /* ------- TEXT LABELS -------*/

          var text = svg.select(".labels").selectAll("text")
            .data(pie(data), key);

          text.enter()
            .append("text")
            .attr("dy", ".35em")
            .text(function(d) {
              return d.data.name;
            });
          
          function midAngle(d){
            return d.startAngle + (d.endAngle - d.startAngle)/2;
          }

          text.transition().duration(1000)
            .attrTween("transform", function(d) {
              this._current = this._current || d;
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
              };
            })
            .styleTween("text-anchor", function(d){
              this._current = this._current || d;
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
              };
            });

          text.exit()
            .remove();

          /* ------- SLICE TO TEXT POLYLINES -------*/

          var polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(data), key);
          
          polyline.enter()
            .append("polyline");

          polyline.transition().duration(1000)
            .attrTween("points", function(d){
              this._current = this._current || d;
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
              };			
            });
          
          polyline.exit()
            .remove();
      },
      getInstitution: function() {
        this.$axios({
        method: "get",
        url: "http://localhost:8081/institution", 
        }).then(response => {
          let res = [];
          response.data.forEach(item => {
            res.push(item.institution);
          })
          this.institutions = res;
          console.log("insitution",this.institutions);   
        }).catch(error => console.log(error, "error")); 
      },

      getInstitutionDetail: function() {
        this.$axios({
        method: "post",
        data: {
          selected: this.selected  
        },
        url: "http://localhost:8081/institutionDetail",
        }).then(response => {
          this.PieDate = response.data;
          console.log("pasd",this.PieDate)
        }).catch(error => console.log(error, "error")); 
      },
    }
  }
</script>
<style>
.Pie-chart-container{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.center {
  width: 1200px;
  /* background: #000; */
  height: 700px;
}
.select{
  display: flex;
  width: 300px;
}


.PieSvg {
  margin-left: 100px;
	width: 100%;
	height: 100%;
}

path.slice{
	stroke-width:2px;
}

polyline{
	opacity: .3;
	stroke: black;
	stroke-width: 2px;
	fill: none;
}

</style>
