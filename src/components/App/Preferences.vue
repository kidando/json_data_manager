<template>
  <div id="preferences">
    <v-dialog v-model="show" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Preferences</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-checkbox
              v-model="preferences.autoSave"
              label="Auto-Save"
            ></v-checkbox>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="onPressedClosePreferences"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
import { mapGetters, mapState } from "vuex";
export default {
  name: "Preferences",
  props: {
    show: Boolean,
  },

  
  data: () => ({
    preferences: {
      name: "settings",
      autoSave: true,
    },
  }),
  watch: {
    show: function (val, oldVal) {
      if (val) {
  
        if (this.$store.state.preferences != null) {
   
          this.preferences.autoSave = this.$store.state.preferences.autoSave;
        } else {

          this.preferences.autoSave = true;
        }
      }
    },
  },
  methods: {
    onPressedClosePreferences() {
      ipcRenderer.send("on_preferences_updated", this.preferences);
      ipcRenderer.on("on_preferences_updated_success", (event, arg) => {
        console.log("Successfully Updated Preferences"); // prints "pong"
      });
      this.$emit("dialogClosed");
    },
  },
};
</script>

<style>
</style>