<template>
  <div id="add-data-file-record-dialog">
    <v-dialog :value="showRecordDialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{action_header}}</span>
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
                  <div
                    v-if="
                      column.data_type == 'String' ||
                      column.data_type == 'Other (Custom)'
                    "
                  >
                    <v-text-field
                      :id="i.toString()"
                      :label="column.name"
                      :value="column.default_value"
                      v-model="input_fields[i].value"
                    >
                    </v-text-field>
                  </div>
                  <div v-else-if="column.data_type == 'Number'">
                    <v-text-field
                      v-model="input_fields[i].value"
                      :label="column.name"
                      type="number"
                    >
                    </v-text-field>
                  </div>

                  <div v-else-if="column.data_type == 'Dictionary'">
                    <div>{{ column.name }}</div>

                    <v-text-field
                      v-model="dictionary_fields[j].value"
                      v-for="(variable, j) in column.default_value"
                      :key="j"
                      :label="[variable.name + ' (' + variable.type + ')']"
                    >
                    </v-text-field>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeModal"> Cancel </v-btn>
          <v-btn @click="onActionPressed" color="blue darken-1" text>
            {{action_button_text}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "AddDataFileRecordDialog",
  props: {
    showRecordDialog: Boolean,
    column_definitions: Array,
    action: String,
    row_data: Object,
  },
  data: () => ({
    show_alert: false,
    alert_text: "",
    input_fields: [],
    dictionary_fields: [],
    action_header: "",
    action_button_text: ""
  }),

  beforeMount() {
    if (this.action == "edit") {
      this.action_header = "Update Record";
      this.action_button_text = "Update";
      for (const [key, value] of Object.entries(this.row_data)) {
        this.input_fields.push({
          name: key,
          value: value,
        });
      }
    } else {
      this.action_header = "Insert Record";
      this.action_button_text = "Insert";
      for (let i = 0; i < this.column_definitions.length; i++) {
        const column_def = this.column_definitions[i];
        // Sepreate Processing Based On Data Type !!IMPORTANT!! Follow data_type check as on form
        if (column_def.data_type == "String") {
          this.input_fields.push({
            name: column_def.name,
            value: column_def.default_value,
          });
        } else if (column_def.data_type == "Number") {
          this.input_fields.push({
            name: column_def.name,
            value: Number(column_def.default_value),
          });
        }
      }
    }
  },
  methods: {
    setElementRef(el) {
      this.elementRefs.push(el);
    },

    closeModal(row_data = []) {
      this.$emit("addRecordDialogClosed", row_data);
    },
    onActionPressed() {
      const response = {};
      
      const row_data = [];

      this.show_alert = false;
      let is_valid = true;
      let error_list = "";
      for (let i = 0; i < this.column_definitions.length; i++) {
        const column_def = this.column_definitions[i];
        // Sepreate Processing Based On Data Type !!IMPORTANT!! Follow data_type check as on form
        if (
          column_def.data_type == "String"
        ) {
          if (this.input_fields[i].value == "" && column_def.required) {
            is_valid = false;
            error_list += `${this.input_fields[i].name} is required.`;
            error_list += "<br>";
          }
          // Regardless
          row_data.push({
            column: column_def.name,
            value: this.input_fields[i].value,
          });
        } else if (column_def.data_type == "Number") {
          if (this.input_fields[i].value == "" && column_def.required) {
            is_valid = false;
            error_list += `${this.input_fields[i].name} is required.`;
            error_list += "<br>";
          }
          // Regardless
          row_data.push({
            column: column_def.name,
            value: this.input_fields[i].value,
          });
        }
      }

      if (!is_valid) {
        this.show_alert = true;
        this.alert_text = error_list;
        return;
      }

      if(this.action=="edit"){
        response['action'] = "edit";
        response['row_id'] = this.row_data._id;
      }else{
        response['action'] = "add";
      }
      response['row_data'] = row_data;

      this.closeModal(response);
    },
  },
};
</script>

<style>
</style>