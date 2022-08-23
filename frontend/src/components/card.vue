<template>
  <v-card
    class="mx-auto"
    max-width="400"
  >
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="text-h5">
          Graph Setting
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>


    <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-circle-slice-8</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>Totoal Node: {{MaxNode}}</v-list-item-subtitle>
    </v-list-item>

   
   <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-eye</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>Render Node: {{Limit}}</v-list-item-subtitle>
    </v-list-item>

    <v-slider
      v-model="Limit"
      :max=MaxNode
      class="mx-4"
      :thumb-color="ex3.color"
      thumb-label="always"
      @click="slide"
    ></v-slider>

     <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-vector-line</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>Render Link: {{NumLink}}</v-list-item-subtitle>
    </v-list-item>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn text>
        More
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: 'card',

    props: {
      MaxNode: Number,
      NumLink: Number,
      Limit: Number,
    },
    mounted() {
      this.slide();
    },
    data () {
      return {
        labels: ['SU', 'MO', 'TU', 'WED', 'TH', 'FR', 'SA'],
        ex3: {val: 20, color: 'blue' },
        forecast: [
          { day: 'Tuesday', icon: 'mdi-white-balance-sunny', temp: '24\xB0/12\xB0' },
          { day: 'Wednesday', icon: 'mdi-white-balance-sunny', temp: '22\xB0/14\xB0' },
          { day: 'Thursday', icon: 'mdi-cloud', temp: '25\xB0/15\xB0' },
        ],
      }
    },
    methods:{
      slide: function() {
        console.log(this.Limit)
        this.$emit('childByValue', this.Limit)
      }
    }
  }
</script>

<style>

</style>