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
                <v-select
                  :items="column_definitions"
                  item-text="name"
                  v-model="column_definition"
                  label="Column"
                  @change="onChangeColumnDefName"
                  return-object
                  filled
                ></v-select>

                <v-text-field
                  v-model="column_name"
                  label="Column Name"
                ></v-text-field>

                <v-select
                  :items="data_types"
                  v-model="data_type"
                  label="Data Type"
                ></v-select>

                <v-text-field v-model="default_value" label="Default Value">

                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeModal"> Close</v-btn>
          <v-btn color="blue darken-1" text @click="updateColumn"> Update</v-btn>
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
    column_name: "",
    data_type: "",
    column_definition: "",
    default_value:"",
    old_column_name: ""
  }),



  watch: {
    show: function (newVal, oldVal) {
      if ((newVal == true)) {
        this.column_definition = "";
        this.column_name = "";
        this.data_type = "";
        this.default_value = "";
        this.old_column_name = "";
      }
    },
  },

  methods: {
    onChangeColumnDefName(item) {
      this.column_name = item.name;
      this.old_column_name = item.name;
      this.data_type = item.data_type;
      this.default_value = item.default_value;
      
    },
    updateColumn(){
        if(this.column_definition=="" || this.column_definition == null){
            return;
        }
        const column_def = {
            old_column_name:this.old_column_name,
            name: this.column_name,
            data_type: this.data_type,
            default_value: this.default_value
        };
        this.$emit('columnUpdated',column_def);
    },
    closeModal(column_defs) {
      this.$emit("editColumnsDialogClosed");
    },
  },
};
</script>

<style>
</style>