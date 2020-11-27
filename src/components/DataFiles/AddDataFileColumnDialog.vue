<template>
  <div id="data-file-add-column-dialog">
    <v-dialog :value="showAddColumnDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Add Column</span>
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
                  >{{ alert_text }}</v-alert
                >
                <v-text-field
                  v-model="name"
                  ref="name"
                  label="Column (variable) Name"
                  filled
                ></v-text-field>
                <v-select
                  v-model="data_type"
                  ref="data_type"
                  @change="onChangeDataType"
                  :items="data_types"
                  filled
                  label="Data Type"
                ></v-select>
            
                <v-select
                  v-if="data_type == 'Boolean'"
                  v-model="boolean_default_value"
                  :items="boolean_default_values"
    
                  filled
                  label="Default Value"
                ></v-select>

                <v-text-field
                  v-if="data_type == 'Number'"
                  type="number"
                  v-model="number_default_value"
                  label="Default Value"
                  filled
                ></v-text-field>

                <v-text-field
                  v-if="data_type == 'String'"
                  v-model="string_default_value"
      
                  label="Default Value"
                  filled
                ></v-text-field>

             
           

               
                <div class="d-flex justify-space-between">
                 
                  <v-checkbox
                    v-model="column_check_required"
                    label="Required"
                  ></v-checkbox>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeModal"> Cancel </v-btn>
          <v-btn @click="onPressedAddColumn" color="blue darken-1" text>
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const array = require("lodash/array");
export default {
  name: "AddDataFileColumnDialog",
  props: {
    showAddColumnDialog: Boolean,
  },
  data: () => ({
    show_alert: false,
    alert_text: "",
    name: "",
    custom_type_name: "",
    data_type: "String",
    column_check_required: true,
    boolean_default_value: "True",
    number_default_value: 0,
    string_default_value: "",
    boolean_default_values: ["", "True", "False"],
    data_types: [
      "Boolean",
      "Number",
      "String"
    ],
    rules: {
      required: (value) => !!value || "Required",
    },
  }),
  mounted() {
    this.clearFields();
  },
  methods: {
    clearFields() {
      this.name = "";
      this.data_type = "";

      this.boolean_default_value = "";
      this.number_default_value = 0;
      this.string_default_value = "";
    },
    onPressedAddColumn() {
      this.show_alert = false;

      if (this.name == "" || this.data_type == "") {
        this.show_alert = true;
        this.alert_text = "You must set a column/variable name and type";
        return;
      }

      let column_definition = {};

      switch (this.data_type) {
        case "Boolean":
          column_definition = {
            name: this.name,
            data_type: this.data_type,
            default_value: this.boolean_default_value,
            required: this.column_check_required,
          };
          break;

    

        case "Number":
          column_definition = {
            name: this.name,
            data_type: this.data_type,
            default_value: Number(this.number_default_value),
            required: this.column_check_required,
          };

          break;


        case "String":
          column_definition = {
            name: this.name,
            data_type: this.data_type,
            default_value: this.string_default_value,
            required: this.column_check_required,
          };
          break;
      }

      this.clearFields();

      this.closeModal(column_definition);
    },

    onPressedAddVariable() {
      const dictionary_item = {
        name: this.dictionary_var,
        type: this.dictionary_var_type,
        value: this.dictionary_val,
      };
      this.dictionary_var_list.push(dictionary_item);

      (this.dictionary_var_type = ""),
        (this.dictionary_val = ""),
        (this.dictionary_var = "");
    },

    closeModal(column_definition = []) {
      this.$emit("addColumnDialogClosed", column_definition);
    },
    onChangeDataType(item) {
      switch (item) {
        case "Boolean":
          this.boolean_default_value = "";
          break;



        case "Number":
          this.number_default_value = 0;
          break;


        case "String":
          this.string_default_value = "";
          break;
      }
    },
  },
};
</script>

<style lang="scss">
.default-list-table {
  width: 100%;
  tr {
    td {
      padding: 3px 10px;
      border: 1px solid #ccc;
    }
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
}
</style>