<template>
  <div id="data-file-add-column-dialog">
    <v-dialog :value="showDialog" persistent max-width="600px">
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
                <v-text-field
                  v-if="data_type == 'Other (Custom)'"
                  v-model="custom_type_name"
                  label="Custom Type Name"
                  filled
                ></v-text-field>
                <v-select
                  v-if="data_type == 'Boolean'"
                  v-model="boolean_default_value"
                  :items="boolean_default_values"
                  :disabled="column_check_null"
                  filled
                  label="Default Value"
                ></v-select>

                <v-text-field
                  v-if="data_type == 'Number'"
                  type="number"
                  v-model="number_default_value"
                  :disabled="column_check_null"
                  label="Default Value"
                  filled
                ></v-text-field>

                <v-text-field
                  v-if="data_type == 'String' || data_type == 'Other (Custom)'"
                  v-model="string_default_value"
                  :disabled="column_check_null"
                  label="Default Value"
                  filled
                ></v-text-field>

                <table
                  v-if="
                    data_type == 'Dictionary' && dictionary_var_list.length > 0
                  "
                  cellpadding="0"
                  cellspacing="0"
                  class="default-list-table mb-3"
                >
                  <tr v-for="(item, index) in dictionary_var_list" :key="index">
                    <td class="d-flex justify-space-between">
                      <span
                        >{{ item.name }}({{ item.type }}) =
                        {{ item.value }}</span
                      ><span
                        ><a
                          @click.prevent="
                            onPressedDictionaryListItemRemove(item)
                          "
                          href=""
                          ><i class="fas fa-times-circle"></i></a
                      ></span>
                    </td>
                  </tr>
                </table>

                <div v-if="data_type == 'Dictionary'" class="d-flex">
                  <v-text-field
                    class="mr-2"
                    v-model="dictionary_var"
                    :disabled="column_check_null"
                    label="Variable Name"
                    filled
                  ></v-text-field>
                  <v-select
                    v-model="dictionary_var_type"
                    @change="onChangeDictionaryDataType"
                    :items="dicationary_data_types"
                    :disabled="column_check_null"
                    filled
                    label="Variable Type"
                  ></v-select>
                  <v-text-field
                    class="ml-2"
                    v-model="dictionary_val"
                    :disabled="column_check_null"
                    label="Default Value"
                    filled
                  ></v-text-field>
                </div>
                <div
                  v-if="data_type == 'Dictionary'"
                  class="d-flex justify-center"
                >
                  <v-btn outlined color="primary" @click="onPressedAddVariable"
                    >Add Variable</v-btn
                  >
                </div>

                <div v-if="data_type == 'Vector2'" class="d-flex">
                  <v-text-field
                    class="mr-2"
                    v-model="vector2_x"
                    :disabled="column_check_null"
                    label="Default Vector2.x"
                    type="number"
                    filled
                  ></v-text-field>
                  <v-text-field
                    class="ml-2"
                    v-model="vector2_y"
                    :disabled="column_check_null"
                    label="Default Vector2.y"
                    type="number"
                    filled
                  ></v-text-field>
                </div>
                <div v-if="data_type == 'Vector3'" class="d-flex">
                  <v-text-field
                    class="mr-2"
                    v-model="vector3_x"
                    :disabled="column_check_null"
                    label="Default Vector3.x"
                    type="number"
                    filled
                  ></v-text-field>
                  <v-text-field
                    class="mr-1 ml-1"
                    v-model="vector3_y"
                    :disabled="column_check_null"
                    label="Default Vector3.y"
                    type="number"
                    filled
                  ></v-text-field>
                  <v-text-field
                    class="ml-2"
                    v-model="vector3_z"
                    :disabled="column_check_null"
                    label="Default Vector3.z"
                    type="number"
                    filled
                  ></v-text-field>
                </div>
                <table
                  cellpadding="0"
                  cellspacing="0"
                  class="default-list-table mb-3"
                  v-if="
                    data_type == 'List (Array)' && default_array_list.length > 0
                  "
                >
                  <tr v-for="(item, index) in default_array_list" :key="index">
                    <td class="d-flex justify-space-between">
                      <span>{{ item }}</span>
                      <span
                        ><a
                          @click.prevent="onPressedRemoveFromList(item)"
                          href=""
                          ><i class="fas fa-times-circle"></i></a
                      ></span>
                    </td>
                  </tr>
                </table>
                <v-text-field
                  v-if="data_type == 'List (Array)'"
                  v-model="item_to_add_to_list"
                  :disabled="column_check_null"
                  @keyup.enter="onKeyupEnterAddToList"
                  label="Array Item (hit ENTER)"
                  filled
                ></v-text-field>
                <div class="d-flex justify-space-between">
                  <v-checkbox
                    v-model="column_check_null"
                    label="NULL default"
                  ></v-checkbox>
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
    showDialog: Boolean,
  },
  data: () => ({
    show_alert: false,
    alert_text: "",
    name: "",
    custom_type_name: "",
    data_type: "String",
    column_check_null: false,
    vector2_x: 0,
    vector2_y: 0,
    vector3_x: 0,
    vector3_y: 0,
    vector3_z: 0,
    dictionary_var: "",
    dictionary_var_type: "",
    dictionary_val: "",
    dictionary_var_list: [],
    item_to_add_to_list: "",
    column_check_required: true,
    boolean_default_value: "True",
    number_default_value: 0,
    string_default_value: "",
    boolean_default_values: ["", "True", "False"],
    default_array_list: [],
    dicationary_data_types: [
      "Boolean",
      "Number",
      "String",
      "Vector2",
      "Vector3",
      "Other (Custom)",
    ],
    data_types: [
      "Boolean",
      "Dictionary",
      "List (Array)",
      "Number",
      "String",
      "Vector2",
      "Vector3",
      "Other (Custom)",
    ],
    rules: {
      required: (value) => !!value || "Required",
    },
  }),
  mounted(){
    this.clearFields();
  },
  methods: {
    clearFields() {
      this.name = "";
      this.data_type = "";
    
      this.boolean_default_value = "";
      this.distionary_var_list = [];
      this.dictionary_var = "";
      this.dictionary_var_type = "";
      this.dictionary_val = "";
      this.number_default_value = 0;
      this.item_to_add_to_list = "";
      this.default_array_list = [];
      this.string_default_value = "";
      this.vector2_x = 0;
      this.vector2_y = 0;
      this.vector3_x = 0;
      this.vector3_y = 0;
      this.vector3_z = 0;
      this.custom_type_name = "";
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
            is_null_default_instead: this.column_check_null,
          };
          break;

        case "Dictionary":
          column_definition = {
            name: this.name,
            data_type: this.data_type,
            default_value: this.dictionary_var_list,
            is_null_default_instead: this.column_check_null,
          };

          break;

        case "Number":
          column_definition = {
            name: this.name,
            data_type: this.data_type,
            default_value: this.number_default_value,
            is_null_default_instead: this.column_check_null,
          };

          break;

        case "List (Array)":
          break;

        case "String":
          column_definition = {
            name: this.name,
            data_type: this.data_type,
            default_value: this.string_default_value,
            is_null_default_instead: this.column_check_null,
          };
          break;

        case "Vector2":
          column_definition = {
            name: this.name,
            data_type: this.data_type,
            default_value: `Vector2(${
              this.vector2_x == "" ? this.vector2_x : 0
            },${this.vector2_y == "" ? this.vector2_y : 0})`,
            is_null_default_instead: this.column_check_null,
          };

          break;

        case "Vector3":
          column_definition = {
            name: this.name,
            data_type: this.data_type,
            default_value: `Vector3(${
              this.vector3_x == "" ? this.vector3_x : 0
            },${this.vector3_y == "" ? this.vector3_y : 0},${
              this.vector3_z == "" ? this.vector3_z : 0
            })`,
            is_null_default_instead: this.column_check_null,
          };
          break;

        case "Other (Custom)":
          column_definition = {
            name: this.name,
            data_type: this.data_type,
            default_value: this.string_default_value,
            is_null_default_instead: this.column_check_null,
          };
          break;
      }

      this.clearFields();

      this.closeModal(column_definition);
    },
    onPressedDictionaryListItemRemove(item) {
      for (let i = 0; i < this.dictionary_var_list.length; i++) {
        if (item == this.dictionary_var_list[i]) {
          this.dictionary_var_list.splice(i, 1);
          break;
        }
      }
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
    onPressedRemoveFromList(item) {
      for (let i = 0; i < this.default_array_list.length; i++) {
        if (this.default_array_list[i] == item) {
          this.default_array_list.splice(i, 1);
          break;
        }
      }
    },
    onKeyupEnterAddToList() {
      this.default_array_list.push(this.item_to_add_to_list);
      this.item_to_add_to_list = "";
    },
    closeModal(column_definition = []) {
      this.$emit("dialogClosed", column_definition);
    },
    onChangeDataType(item) {
      switch (item) {
        case "Boolean":
          this.boolean_default_value = "";
          break;

        case "Dictionary":
          this.distionary_var_list = [];
          this.dictionary_var = "";
          this.dictionary_var_type = "";
          this.dictionary_val = "";
          break;

        case "Number":
          this.number_default_value = 0;
          break;

        case "List (Array)":
          this.item_to_add_to_list = "";
          this.default_array_list = [];
          break;

        case "String":
          this.string_default_value = "";
          break;

        case "Vector2":
          this.vector2_x = 0;
          this.vector2_y = 0;
          break;

        case "Vector3":
          this.vector3_x = 0;
          this.vector3_y = 0;
          this.vector3_z = 0;
          break;

        case "Other (Custom)":
          this.custom_type_name = "";
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