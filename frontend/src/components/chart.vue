<template>
  <div id='BarChart'>
    <!-- <h2>Bar chart example</h2> -->
    <div id='BarContainer'>
      <div class = "select">
        <v-select
            v-model="selected"
            :items="institutions"
            label="Solo field"
            solo>
        </v-select>
      </div>
      <svg id = "BarCharSvg"/>
    </div>
  </div>
</template>

<script type="text/javascript" src="d3.v5.min.js"></script>

<script>

  export default {
    name: 'chart',
    mounted(){
      this.getInstitution();
      this.draw();
    },

    watch: {
      selected(val) {
        this.getInstitutionDetail()
        this.draw();
      },
    },
    
    data(){
      return {
        selected : "Boston University",
        institutions:[],
        BarData:[],
      }
    },
    methods:{
      draw: function() {
        
        this.$axios({
        method: "post",
        data: {
          selected: this.selected   // 传接口参数
        },
        url: "http://localhost:8081/institutionDetail", // 接口地址
        }).then(response => {
          
        let BarDate = response.data.slice(0, 10);
        //处理数据
        console.log("pasd",BarDate)
        let color = ['#900C3F', '#00a2ee', '#fbcb39', '#007bc8', '#65cedb','#ff6e52','#f9de3f','#5d2f8e','#008fc9','#507dca']
        let renderData = []
        let max = 0;
        let total = 0;
        for(let i = 0; i < BarDate.length; i++) {
          total += BarDate[i].total;
          max = Math.max(max, BarDate[i].total)
          renderData.push({language: BarDate[i].topic.slice(0, 25), value: BarDate[i].total, color: color[i]})
        }
        console.log("renderData",renderData)

        d3.select("#BarCharSvg").remove();

        const svg = d3.select('#BarContainer').append("svg").attr("id", "BarCharSvg")
        const svgContainer = d3.select('#BarContainer');
    
        const margin = 80;
        const width = 1200 - 2 * margin;
        const height = 600 - 2 * margin;

        const chart = svg.append('g')
          .attr('transform', `translate(${margin}, ${margin})`);

        const xScale = d3.scaleBand()
          .range([0, width])
          .domain(renderData.map((s) => s.language))
          .padding(0.4)
        
        const yScale = d3.scaleLinear()
          .range([height, 0])
          .domain([0, max]);

        const makeYLines = () => d3.axisLeft()
          .scale(yScale)

        chart.append('g')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(xScale));

        chart.append('g')
          .call(d3.axisLeft(yScale));

        chart.append('g')
      .attr('class', 'grid')
      .call(makeYLines()
        .tickSize(-width, 0, 0)
        .tickFormat('')
      )

    const barGroups = chart.selectAll()
      .data(renderData)
      .enter()
      .append('g')

    barGroups
      .append('rect')
      .attr('fill', (g) => g.color)
      .attr('x', (g) => xScale(g.language))
      .attr('y', (g) => yScale(g.value))
      .attr('height', (g) => height - yScale(g.value))
      .attr('width', xScale.bandwidth())
      .on('mouseenter', function (actual, i) {
        d3.selectAll('.value')
          .attr('opacity', 0)

        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 0.6)
          .attr('x', (a) => xScale(a.language) - 5)
          .attr('width', xScale.bandwidth() + 10)

        const y = yScale(actual.value)

        let line = chart.append('line')
          .attr('id', 'limit')
          .attr('x1', 0)
          .attr('y1', y)
          .attr('x2', width)
          .attr('y2', y)

        barGroups.append('text')
          .attr('class', 'divergence')
          .attr('x', (a) => xScale(a.language) + xScale.bandwidth() / 2)
          .attr('y', (a) => yScale(a.value) + 30)
          .attr('fill', 'white')
          .attr('text-anchor', 'middle')
          .text((a, idx) => {
            const divergence = (a.value / total).toFixed(2)
            
            let text = ''
            if (divergence > 0) text += '+'
            text += `${divergence}%`

            return idx == i ? text : '';
          })

      })
      .on('mouseleave', function () {
        d3.selectAll('.value')
          .attr('opacity', 1)

        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 1)
          .attr('x', (a) => xScale(a.language))
          .attr('width', xScale.bandwidth())

        chart.selectAll('#limit').remove()
        chart.selectAll('.divergence').remove()
      })

    barGroups 
      .append('text')
      .attr('class', 'value')
      .attr('x', (a) => xScale(a.language) + xScale.bandwidth() / 2)
      .attr('y', (a) => yScale(a.value) + 30)
      .attr('text-anchor', 'middle')
      .text((a) => `${a.value}`)
    
    svg
      .append('text')
      .attr('class', 'label')
      .attr('x', -(height / 2) - margin)
      .attr('y', margin / 2.4)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text('Paper')

    svg.append('text')
      .attr('class', 'label')
      .attr('x', width / 2 + margin)
      .attr('y', height + margin * 1.7)
      .attr('text-anchor', 'middle')
      .text('Category')

    svg.append('text')
      .attr('class', 'title')
      .attr('x', width / 2 + margin)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text(`The ten most popular areas of study at ${this.selected}`)

    // svg.append('text')
    //   .attr('class', 'source')
    //   .attr('x', width - margin / 2)
    //   .attr('y', height + margin * 1.7)
    //   .attr('text-anchor', 'start')
    //   .text('Source: Stack Overflow, 2018')
     })
    },
    getInstitution: function() {
        this.$axios({
        method: "get",
        url: "http://localhost:8081/institution", // 接口地址
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
          this.BarDate = response.data;
          console.log("pasd",this.BarDate)
        }).catch(error => console.log(error, "error")); 
      },
    },
  }
</script>

<style>


#BarChart {
  display: flex;
  width: 100vw;
  height: 100vh; 
  justify-content: center;
  align-items: center;
}

#BarCharSvg {
  width: 80vw;
  height: 80vh;
}
.select{
  display: flex;
  flex-direction: row;
}
.bar {
  fill: #80cbc4;
}

text {
  font-size: 12px;
  fill: black;
}

path {
  stroke: gray;
}

line {
  stroke: gray;
}

line#limit {
  stroke: #FED966;
  stroke-width: 3;
  stroke-dasharray: 3 6;
}

.grid path {
  stroke-width: 0;
}

.grid .tick line {
  stroke: #9FAAAE;
  stroke-opacity: 0.3;
}

text.divergence {
  font-size: 14px;
  fill: #2F4A6D;
}

text.value {
  font-size: 14px;
}

text.title {
  font-size: 22px;
  font-weight: 600;
}

text.label {
  font-size: 14px;
  font-weight: 400;
}

text.source {
  font-size: 10px;
}
</style>