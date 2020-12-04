<template>
  <div id="add-data-file-record-dialog">
    <v-dialog :value="showRecordDialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="d-flex justify-space-between">
          <span class="headline">{{ action_header }} </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-alert
                  v-model="show_alert"
                  color="red"
                  dismissible
                  type="error"
                  v-html="alert_text"
                ></v-alert>

                <div v-for="(column, i) in column_definitions" :key="i">
                  <v-text-field
                    v-model="inputs[column._id]"
                    v-if="column.data_type == 'String'"
                    :label="column.name"
                  ></v-text-field>
                  <v-text-field
                    v-model="inputs[column._id]"
                    type="number"
                    v-if="column.data_type == 'Number'"
                    :value="column.default_value"
                    :label="column.name"
                  ></v-text-field>
                  <v-select
                    v-model="inputs[column._id]"
                    v-if="column.data_type == 'Boolean'"
                    :items="boolean_options"
                    :label="column.name"
                  ></v-select>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeModal"> Cancel </v-btn>
          <v-btn @click="onActionPressed" color="blue darken-1" text>
            {{ action_button_text }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>



<script>
import { v4 as uuidv4 } from "uuid";
export default {
  name: "DataFileRecordDialog",
  props: {
    showRecordDialog: Boolean,
    column_definitions: Array,
    action: String,
    row_data: Object,
  },
  data: () => ({
    show_alert: false,
    alert_text: "",
    boolean_options: [
      {
        text: "No Default",
        value: "",
      },
      {
        text: "true",
        value: true,
      },
      {
        text: "false",
        value: false,
      },
    ],
    inputs: {},

    action_header: "",
    action_button_text: "",
  }),

  beforeMount() {
    if (this.action == "add") {
      this.column_definitions.forEach((column) => {
        this.inputs[column._id] = column.default_value;
      });
    } else {
      this.column_definitions.forEach((column) => {
        for (const [key, value] of Object.entries(this.row_data)) {
          if(key==column.name){
            this.inputs[column._id] = value;
            break;
          }
        }

        
      });
    }
  },

  mounted() {
    if (this.action == "insert") {
      this.action_header = "Insert New Record";
      this.action_button_text = "Insert";
      // Pre-build the v-models for inputs bind to column_ids
    } else {
      // this.action == "edit"
      this.action_header = "Update Record";
      this.action_button_text = "Update";
    }
  },

  methods: {
    closeModal(response = {}) {
      this.$emit("onRecordDialogClosed", response);
    },
    onActionPressed() {
      const _row = {};
      let _action = "insert";
      if (this.action == "insert") {
        _row["_id"] = uuidv4();
      }else{
         _action = "update";
        _row["_id"] = this.row_data._id;
      }

      for (let i = 0; i < this.column_definitions.length; i++) {
          const _column = this.column_definitions[i];
          for (const [key, value] of Object.entries(this.inputs)) {
            if (_column._id == key) {
              _row[_column.name] = value;
              break;
            }
          }
        }

      const response = {
        row_data: _row,
        action: _action,
      };

      this.$emit("onRecordDialogClosed", response);
    },
  },
};
</script>

<style>
</style>