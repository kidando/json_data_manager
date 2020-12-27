<template>
  <v-app>
    <v-navigation-drawer fixed v-model="drawer" app>
      <v-list nav dense>
        <v-list-item-group>
          
           

          
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon color="black">fa-file-alt</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Data Files</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/projects">
            <v-list-item-icon>
              <v-icon color="black">fa-folder-open</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Projects</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar dark color="blue" dense flat app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>
    </v-app-bar>
    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
        <AddDataFileDialog
          @dialogClosed="onDialogClosed"
          :toggleShow="toggleShow"
        ></AddDataFileDialog>
        <Preferences
          :show="showPreferences"
          @dialogClosed="onPressedClosePreferences"
        ></Preferences>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import AddDataFileDialog from "./components/DataFiles/AddDataFileDialog.vue";
import Preferences from "./components/App/Preferences.vue";
const { ipcRenderer } = require("electron");
export default Vue.extend({
  name: "App",

  components: {
    AddDataFileDialog,
    Preferences,
  },

  data: () => ({
    drawer: true,
    toggleShow: false,
    showPreferences: false,
    title: "JSON Data Manager",
  }),
  mounted() {
    if (!this.showPreferences) {
      ipcRenderer.on("on_menu_preferences_clicked", (event: any, data: any) => {
        this.showPreferences = true;
      });
    }

    this.$store.dispatch('getAppPreferences');
    
  },
  methods: {
    onDialogClosed() {
      this.toggleShow = false;
    },
    onPressedClosePreferences() {
      this.showPreferences = false;
    },
    createDataFile() {
      this.toggleShow = true;
    },
  },
});
</script>

<style lang="scss">
.v-main__wrap {
  background-color: #f2f2f2;
}
.clear-active {
  background-color: #fff !important;
}
</style>
