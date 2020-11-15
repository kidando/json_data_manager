<template>
  <v-app>
    <v-row no-gutters>
      <v-col>
 <div class="d-flex">
        <Sidebar></Sidebar>
        <router-view></router-view>
      </div>
      </v-col>
     
    
    </v-row>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Sidebar from "./components/App/Sidebar.vue";

export default Vue.extend({
  name: "App",

  components: {
    Sidebar,
  },

  data: () => ({
    //
  }),
});
</script>
