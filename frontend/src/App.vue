<template>
  <v-app>
    <v-main>
      <home/>
    </v-main>
  </v-app>
</template>

<script>
import home from './components/home';

export default {
  name: 'App',

  components: {
    home,
  },

  data: () => ({
    //
  }),
};
</script>
