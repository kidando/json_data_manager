<template>
  <v-app>
    
    <v-navigation-drawer fixed v-model="drawer" app>
      <v-list
        nav
        dense
      >
        <v-list-item-group
      
      
        >
          <v-list-item active-class="clear-active" @click="createDataFile">
            <v-list-item-icon>
            <v-icon color="black">fa-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>New Data File</v-list-item-title>
          </v-list-item-content>
          </v-list-item>

         <v-list-item to="/">
            <v-list-item-icon>
            <v-icon color="black">fa-file-alt</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Data Files</v-list-item-title>
          </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar dark color="blue" dense flat  app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>{{title}}</v-toolbar-title>
    </v-app-bar>
<!-- Sizes your content based upon application components -->
  <v-main>

    <!-- Provides the application the proper gutter -->
    <v-container fluid>

      <!-- If using vue-router -->
      <router-view></router-view>
      <AddDataFileDialog
      @dialogClosed="onDialogClosed"
      :toggleShow="toggleShow"></AddDataFileDialog>
    </v-container>
  </v-main>

  <v-footer app>
    <!-- -->
  </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import AddDataFileDialog from './components/DataFiles/AddDataFileDialog.vue';

export default Vue.extend({
  name: "App",

  components: {
    AddDataFileDialog
  },

  data: () => ({
    drawer: true,
    toggleShow: false,
    title:"JSON Data Manager"
  }),
  methods:{
    onDialogClosed() {
      this.toggleShow = false;
    },
    createDataFile(){
      this.toggleShow = true;
    }
  }
});
</script>

<style lang="scss">

.v-main__wrap{
  background-color: #f2f2f2;

}
.clear-active{
  background-color: #fff!important;
}
</style>
