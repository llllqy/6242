<template>
  <div>
    <div class = "side-container">
    <v-card class = "side-card" >
      <v-container fluid>
      <v-row align="center">
        Filter
      </v-row>
      <v-row align="center">
          <v-select
            v-model="selected_ins"
            :items="institutions"
            :menu-props="{ maxHeight: '400' }"
            label="Select"
            multiple
            hint="Select academic institutions"
            persistent-hint
          ></v-select>
      </v-row>
      <v-row align="center">
          <v-select
            v-model="selected_cate"
            :items="categories"
            label="Select"
            multiple
            chips
            hint="Select categories"
            persistent-hint
          ></v-select>
      </v-row>
      </v-container>
    </v-card>
    </div>
    <div class="paper-container">
    <div class="paper-list" v-for="item in paperList" :key="item.id">

      <!-- paper list 写成一个dialog -->
      <div>
        <v-dialog
          width="800"
        >
        <template v-slot:activator="{ on, attrs }">
        <v-card 
            class="paper-item"
            outlined
            v-bind="attrs"
            v-on="on"
            >
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="text-h5 mb-1">
                {{item.title}}
              </v-list-item-title>
              <v-list-item-title class="text-h5">
                <span class="font-weight-thin text-subtitle-1"> {{item.author}} </span>
                <span class="font-weight-thin text-subtitle-1 ml-4" > {{item.affiliation}}</span>
              </v-list-item-title>
              <v-list-item-subtitle>key words: {{item.key_word}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </template>

          <v-card>
            <v-card-title class="text-h5 lighten-2">
            {{item.title}}
            </v-card-title>
              <div style="width:100%; border: 1px solid #d0d0d0;"></div>
            <v-card-text>
              <div class="text-subtitle-1 font-weight-black">Abstract:</div> {{item.abstract}}
            </v-card-text>
            <v-card-text>
              <span class="text-subtitle-1 font-weight-black">Author:</span> {{item.author}}
              <span class="ml-8 text-subtitle-1 font-weight-black">Institute:</span> {{item.affiliation}}
            </v-card-text>
            <v-card-text>
              <span class="text-subtitle-1 font-weight-black">Categories:</span> {{item.categories}}
              <span class="ml-8 text-subtitle-1 font-weight-black">ID:</span> {{item.id}}
            </v-card-text>
            <v-card-text>
              <span class="text-subtitle-1 font-weight-black">Key words: {{item.key_word}}</span>
            </v-card-text>
            <v-card-text>
              <div class="text-subtitle-1 font-weight-black">Related Paper:</div>
              <div v-for="value in item.relatePaper" :key="value[1]"><span class="font-weight-black">Title: </span>{{value[0]}} <span class="ml-5 font-weight-black"> Match ratio:</span> {{value[1]}} </div>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </div>

    <div class="text-center pagination">
      <v-pagination
        v-model="curPage"
        :length="pageLength"
        :total-visible="7"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        @input="onPageChange"
      ></v-pagination>
    </div>
  </div>
  </div>

  
</template>
<script type="text/javascript" src="d3.v5.min.js"></script>

<script>
export default {
    name: 'paperList',
    mounted() {
      this.getData();
      this.getInstitution();
      this.GetPaper4000();
    },
    props: {
      searchWord: String,
    },
    data() {
      return {
        curPage:1,
        pageLength: 41136,
        itemsPerPage: 6,//每页条目数
        paperData:[],
        paperList:[],
        selected_ins:[],
        selected_cate: [],
        institutions: [],
        PaperMap:new Map(),
        flag:false,
        categories: ["Statistical Mechanics","Probability","Physics and Society","High Energy Physics - Theory","Quantum Physics","Information Theory","Optics","High Energy Physics - Phenomenology","Machine Learning","Data Analysis, Statistics and Probability","Strongly Correlated Electrons","Computer Vision and Pattern Recognition","High Energy Physics - Lattice","Statistics Theory","Soft Condensed Matter","Methodology","Mesoscale and Nanoscale Physics","Populations and Evolution","Computer Science and Game Theory","Differential Geometry","Computational Complexity","Algebraic Topology","Optimization and Control","Astrophysics of Galaxies","General Relativity and Quantum Cosmology","Distributed, Parallel, and Cluster Computing","Systems and Control","Mathematical Physics","Robotics","Solar and Stellar Astrophysics","Cryptography and Security","Cosmology and Nongalactic Astrophysics","Networking and Internet Architecture","Computation and Language","Data Structures and Algorithms","High Energy Astrophysical Phenomena","Materials Science","Quantitative Methods","Signal Processing","Disordered Systems and Neural Networks","Quantum Gases","Algebraic Geometry","Earth and Planetary Astrophysics","Pattern Formation and Solitons","Atomic Physics","Numerical Analysis","Software Engineering","Geometric Topology","Chemical Physics","Accelerator Physics","Superconductivity","Programming Languages","Physics Education","Representation Theory","Instrumentation and Detectors","Fluid Dynamics","General Finance","Human-Computer Interaction","Social and Information Networks","High Energy Physics - Experiment","Functional Analysis","Other Condensed Matter","Statistical Finance","Combinatorics","Artificial Intelligence","Analysis of PDEs","Other Computer Science","Chaotic Dynamics","General Physics","Image and Video Processing","Classical Physics","Plasma Physics","Sound","Databases","Computational Physics","Molecular Networks","Number Theory","Neural and Evolutionary Computing","Adaptation and Self-Organizing Systems","Biological Physics","Cell Behavior","Applications","Nuclear Experiment","Popular Physics","Discrete Mathematics","Applied Physics","Hardware Architecture","Operating Systems","Performance","Instrumentation and Methods for Astrophysics","Information Retrieval","Dynamical Systems","Medical Physics","Multimedia","Computers and Society","Multiagent Systems","Logic","Quantum Algebra","Risk Management","Atmospheric and Oceanic Physics","Digital Libraries","Economics","Trading and Market Microstructure","Formal Languages and Automata Theory","Complex Variables","Symbolic Computation","History and Philosophy of Physics","Space Physics","Audio and Speech Processing","Nuclear Theory","Logic in Computer Science","Classical Analysis and ODEs","Rings and Algebras","Operator Algebras","History and Overview","Spectral Theory","Other Statistics","Computational Engineering, Finance, and Science","Graphics","Pricing of Securities","Category Theory","K-Theory and Homology","Computation","Mathematical Finance","Mathematical Software","Theoretical Economics","Other Quantitative Biology","Neurons and Cognition","Portfolio Management","Metric Geometry","Genomics","Geophysics","Commutative Algebra","Computational Geometry","Biomolecules","Cellular Automata and Lattice Gases","General Topology","Symplectic Geometry","Emerging Technologies","General Mathematics","Computational Finance","Exactly Solvable and Integrable Systems","Group Theory","Econometrics","Atomic and Molecular Clusters","Tissues and Organs","General Literature","General Economics","Subcellular Processes"]
      }
    },
    watch: {
      searchWord(val) {
        if(val.length != 0) {
          this.searchPaper();
          console.log("val",val)
        }
      },
      selected_ins(val) {
        if(this.selected_ins.length == 0) {
          if(this.searchWord != "") {
            this.searchPaper()
          } else {this.getData();} 
        }else {
          this.getInstitutionPaper();
        }
      },
    },
    methods: {
      onPageChange: function() {
        // this.paperList = this.paperData.slice((this.curPage - 1) * this.itemsPerPage, this.curPage * this.itemsPerPage);
        if(this.searchWord != "") {
          this.searchPaper()
        }else if(this.selected_ins.length != 0){
          this.getInstitutionPaper()
        } else {
          this.getData();
        }
      },
      getData: function() {
        this.$axios({
        method: "post",
        url: "http://localhost:8081/paperList", // 接口地址
        // params: {
        //   curPage: this.curPage,
        // },
        data: {
          curPage: this.curPage   // 传接口参数
        }
      }).then(response => {
         // 成功的返回  
        let data = response.data.data;
        //related paper的映射
        for(let i = 0; i < data.length; i++) {
          data[i].key_word = data[i].key_word.slice(1, data[i].key_word.length - 1);
          //how?
          let string = data[i].relatePaper.slice(1, data[i].key_word.length - 1);
          var re = /\[(.+?)\]/gi
          let arr = string.match(re)
          if(arr != null) {
            for(let i = 0; i < arr.length; i++) {
              arr[i] = arr[i].slice(1, arr[i].length - 1)
              arr[i] = arr[i].split(",")
              for(let j = 0; j < arr[i].length; j++) {
                arr[i][j] = Number(arr[i][j]);
              }
            }
          }
          // console.log("arr",arr)
          data[i].relatePaper = arr; 
        }
        this.pageLength = Math.floor((response.data.total[0].total / this.itemsPerPage));
        // let promise = new Promise((resolve, reject) => {
        //       console.log("exec get")

        //     this.GetPaper4000()
        //     resolve()
        //   }).then(res => {
        //     console.log("exec show")
        //     this.show()
        //   })      
        this.$axios({
        method: "get",
        url: "http://localhost:8081/paperList4000", // 接口地址
        }).then(response => {
          console.log(response.data, "GetPaper4000");   // 成功的返回  
          let map = new Map();
          response.data.forEach(ele => {
            map.set(ele.id, ele.title)
          })
          this.PaperMap = map;
          console.log("Map",this.PaperMap)
          let related_paper = [];
          for(let i = 0; i < data.length; i++) {
            if(data[i].relatePaper != null) {
              for(let j = 0; j < data[i].relatePaper.length; j++) {
                data[i].relatePaper[j][0] = this.PaperMap.get(data[i].relatePaper[j][0]);
              }
            }
          }
          this.paperList = data;

          console.log("showdata",data)

        })
       
      }).catch(error => console.log(error, "error")); // 失败的返回
      },


      searchPaper: function() {
        console.log("执行search")
        this.$axios({
        method: "post",
        url: "http://localhost:8081/search", // 接口地址
        data: {
          searchWord: this.searchWord,  // 传接口参数
          curPage: this.curPage   // 传接口参数
        }
        }).then(response => {
          this.paperList = response.data.data;  
          this.pageLength = Math.floor((response.data.length[0].total / this.itemsPerPage)); 
        }).catch(error => console.log(error, "error")); // 失败的返回
      },

      GetPaper4000: function() {
        this.$axios({
        method: "get",
        url: "http://localhost:8081/paperList4000", // 接口地址
        }).then(response => {
          console.log(response.data, "GetPaper4000");   // 成功的返回  
          let map = new Map();
          response.data.forEach(ele => {
            map.set(ele.id, ele.title)
          })
          this.PaperMap = map;
          this.flag = !this.flag;
          console.log("Map",this.PaperMap)
        }).catch(error => console.log(error, "error")); // 失败的返回
      },


      debounce: function(fn, wait) {
        let timer = null;
        return function() {
          if(timer){clearTimeout(timer)};
          timer = setTimeout(() => {
            fn.apply(this, arguments);
          }, wait);
        }
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
          console.log("insitution",this.institutions);   // 成功的返回  
        }).catch(error => console.log(error, "error")); // 失败的返回
      },

      getInstitutionPaper: function() {
        this.$axios({
        method: "post",
        url: "http://localhost:8081/GetInsitutionPaper", // 接口地址
        data: {
          institutions: this.selected_ins,  // 传接口参数  
          curPage: this.curPage   // 传接口参数
        }
        }).then(response => {
          console.log("paera",response)
          let data = response.data.data;
          let total = response.data.total;


          this.paperList = data;
          this.pageLength = Math.floor((total / this.itemsPerPage));
        }).catch(error => console.log(error, "error")); // 失败的返回
      },
    }
  }
</script>

<style>
.paper-container{
  /* 由容器定义高度么 */
  width: 70%;
  height: 95vh;
  /* background: blue; */
  margin-left: 20%;
  /* border: 1px solid; */
}
.side-container{
  width: 18%;
  /* background: #000; */
  margin-left: 10px;
  margin-top: 50px;
  /* border: 1px solid; */
  float: left;;
}
.side-card{
  padding: 20px;
}
.paper-item{
  margin: 10px 10px;
}
.search-container {
  display: flex;
  flex-direction: row;
  padding-left: 20px;
}
paper-item:hover{
  border: 1px solid;
  margin: 12px 12px;
}
/* .pagination{

} */
</style>