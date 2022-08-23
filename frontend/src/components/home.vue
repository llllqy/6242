<template>
  <div height="900px">
    <v-toolbar
        dark
      >
        <v-app-bar-nav-icon 
                  @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>

        <v-toolbar-title>CSE6242 Academic Graph</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-text-field
          v-model = "searchWord"
          label="Search paper"
          hide-details="auto"
        ></v-text-field>

        <v-btn @click="searchPaper" icon>
            <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-export</v-icon>
        </v-btn>
      </v-toolbar>
     <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>CSE6242 Team 9</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="(item, index) in items"
          :key="item.title"
          link
          @click="click(index)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title >{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <graph v-if="show == 0"></graph>
    <chart v-if="show == 1"></chart>
    <chartbar v-if="show == 2"></chartbar>
    <paper-list :searchWord="searchWord" v-if="show == 3"></paper-list>
  </div>
</template>

<script>
import Chart from './chart.vue';
import Chartbar from './chartbar.vue';
import Graph from './graph.vue';
import PaperList from './paperList.vue';


  export default {
    name: 'home',

    components: {
      Graph,
      Chart,
      Chartbar,
      PaperList
    },
    data(){
      return {
        drawer: false,
        items: [
          { title: 'Heterogenous graphs', icon: 'mdi-graphql' },
          { title: 'Chart bar', icon: 'mdi-chart-bar' },
          { title: 'Pie chart', icon: 'mdi-chart-pie' },
          { title: 'paper-list', icon: 'mdi-format-list-bulleted' },

        ],
        show: 3,
        searchWord: "",
      }
    },
    methods: {
      click: function(index) {
        this.show = index
      },
      searchPaper: function() {
        //切换组件
        this.show = 3;
        //
      }
    }
  }
</script>
