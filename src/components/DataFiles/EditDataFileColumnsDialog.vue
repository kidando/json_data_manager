<template>
  <div id="edit-data-file-columns-dialog">
    <v-dialog :value="show" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Columns</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-alert v-model="showAlert" dense outlined type="error">
                  {{alertText}}
                </v-alert>
                <v-select
                  :items="column_definitions"
                  item-text="name"
                  v-model="selected_column_def"
                  label="Column"
                  @change="onChangeColumnDefName"
                  return-object
                  filled
                ></v-select>

                <v-text-field v-model="name" label="Column Name"></v-text-field>

                <v-select
                  :items="data_types"
                  v-model="data_type"
                  label="Data Type"
                ></v-select>

                <v-text-field v-model="default_value" label="Default Value">
                </v-text-field>

                <div class="d-flex justify-space-between">
                  <v-checkbox v-model="required" label="Required"></v-checkbox>
                  <v-checkbox
                    v-model="replace_existing_with_default"
                    label="Replace Existing Values With New Default"
                  ></v-checkbox>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeModal"> Close</v-btn>
          <v-btn color="blue darken-1" text @click="updateColumn">
            Update</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "EditDataFileColumnsDialog",
  props: {
    show: Boolean,
    column_definitions: Array,
    data_types: Array,
  },
  data: () => ({
    _id: "",
    name: "",
    data_type: "",
    default_value: "",
    required: true,
    selected_column_def: "",
    replace_existing_with_default: false,
    showAlert: false,
    alertText: ""
  }),

  methods: {
    onChangeColumnDefName(_column_def) {
      this._id = _column_def._id;
      this.name = _column_def.name;
      this.data_type = _column_def.data_type;
      this.default_value = _column_def.default_value;
      this.required = _column_def.required;
    },

    updateColumn() {
      this.showAlert = false;
      if (
        this.name == this.selected_column_def.name &&
        this.data_type == this.selected_column_def.data_type &&
        this.default_value == this.selected_column_def.default_value &&
        this.required == this.selected_column_def.required
      ) {
        
        return;
      }
      if (this.name == "" || this.data_type == "" || this.data_type == null) {
         this.showAlert = true;
        this.alertText ="You must set name and data type";
        return;
      }
      const column_def = {
        _id: this._id,
        name: this.name,
        data_type: this.data_type,
        default_value: this.default_value,
        required: this.required,
        replace_existing_with_default: this.replace_existing_with_default,
      };

      this._id = "";
      this.name = "";
      this.data_type = "";
      this.default_value = "";
      this.required = true;

      this.$emit("onColumnUpdated", column_def);
    },
    closeModal(column_def = {}) {
      this._id = "";
      this.name = "";
      this.data_type = "";
      this.default_value = "";
      this.required = true;
      this.$emit("onColumnUpdated", column_def);
    },
  },
};
</script>

<style>
</style>