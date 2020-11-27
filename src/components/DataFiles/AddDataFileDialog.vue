<template>
  <div id="data-files-add-form">
    <v-dialog
  
      :value="toggleShow"
      persistent
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Create New Data File</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  :rules="[rules.required]"
                  @keyup.enter="onPressedCreateFile"
                  clearable
                  filled
                  v-model="name"
                  label="Name"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeModal"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="onPressedCreateFile">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="processing_modal" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Saving data file
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar color="success" top right v-model="snackbar" :timeout="timeout">
      Data File Saved
      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>

    </v-snackbar>
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
const _string = require("lodash/string");
export default {
  name: "AddDataFileDialog",
  props: {
    toggleShow: Boolean,
  },
  data: () => ({
    name: "",
    processing_modal: false,
    snackbar: false,
    timeout: 3000,
    rules: {
      required: (value) => !!value || "Required",
    },
  }),
  computed: {},
  methods: {
   
    closeModal() {
      this.$emit("dialogClosed");
    },
    onPressedCreateFile() {
      const file_info = {
        name: this.name,
        proposed_filename: _string.snakeCase(this.name) + ".json",
      };

      ipcRenderer.send("save_file_dialog", file_info);
      this.processing_modal = true;
      ipcRenderer.once("save_file_dialog_response", (event, data) => {
        //data is the printer list
        this.processing_modal = false;
        this.name = "";
        this.closeModal();
        this.snackbar = true;
        this.$router.push(`/data_file/${data._id}`);
      });
    },
  },
};
</script>

<style>
</style>