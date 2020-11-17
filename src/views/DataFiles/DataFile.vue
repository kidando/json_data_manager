<template>
  <v-container fluid>
    <div class="d-flex justify-space-between align-center mb-2">
      <div>
        <h2>{{ name }}</h2>
        <h5 class="font-weight-regular text--lighten-4">{{ file_path }}</h5>
      </div>
      <v-btn @click="onPressedDataFileSave" elevation="0" color="success"
        ><i class="fas fa-save mr-2"></i> Save</v-btn
      >
    </div>
    <hr />
    <v-row>
      <v-col>
        <div class="mb-5">
          <v-btn
            class="mr-3"
            @click="onPressedShowDialogAddColumn"
            elevation="0"
            color="primary"
            ><i class="fas fa-columns mr-2"></i>Add Column</v-btn
          >
          <v-btn
            @click="onPressedShowDialogAddRecord"
            v-if="column_definitions.length > 0"
            elevation="0"
            color="primary"
            class="ml-3"
            ><i class="fas fa-plus mr-2"></i> Insert Record</v-btn
          >
        </div>

        <table
          v-if="column_definitions.length > 0"
          cellspacing="0"
          cellpadding="0"
          class="data-file-table"
        >
          <tr v-for="(row, i) in rows" :key="i">
            <td v-for="(column, j) in row.columns" :key="j" :class="evaluateTdClass(i)">
              {{ column.value }}
            </td>
          </tr>
        </table>
      </v-col>
    </v-row>
    <AddDataFileColumnDialog
      @addColumnDialogClosed="onAddColumnDialogClosed"
      :showAddColumnDialog="showAddColumnDialog"
    ></AddDataFileColumnDialog>

    <AddDataFileRecordDialog
      @addRecordDialogClosed="onAddRecordDialogClosed"
      :showAddRecordDialog="showAddRecordDialog"
      :column_definitions="column_definitions"
      v-if="showAddRecordDialog"
    >
    </AddDataFileRecordDialog>

    <v-dialog v-model="showSaveDialog" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Saving file
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import AddDataFileColumnDialog from "../../components/DataFiles/AddDataFileColumnDialog";
import AddDataFileRecordDialog from "../../components/DataFiles/AddDataFileRecordDialog";
import { v4 as uuidv4 } from "uuid";
const dayjs = require("dayjs");
const { ipcRenderer } = require("electron");
export default {
  name: "DataFile",
  components: {
    AddDataFileColumnDialog,
    AddDataFileRecordDialog,
  },

  data: () => ({
    showAddColumnDialog: false,
    showAddRecordDialog: false,
    db_data_file: null,
    column_definitions: [],
    items: [],
    showSaveDialog: false,
    display_rows: [],
    rows: [],
  }),
  mounted() {
    this.dbGetDataFile(this.$route.params.id);
  },
  computed: {
    name() {
      if (this.db_data_file != null) {
        return this.db_data_file.name;
      }

      return "Loading...";
    },
    file_path() {
      if (this.db_data_file != null) {
        return this.db_data_file.file_path;
      }

      return "Loading...";
    },
  },
  methods: {
    evaluateTdClass(row_index){
      if (row_index == 0) return 'headerClass';
      return '';
    },
    onPressedDataFileSave() {
      const now = dayjs();
      this.showSaveDialog = true;

      const data_file = {
        _id: this.db_data_file._id,
        jdm_data: {
          name: this.db_data_file.name,
          file_path: this.db_data_file.file_path,
          created_at: this.db_data_file.created_at,
          updated_at: now.format("YYYY-MM-DD HH:mm:ss"),
          deleted_at: this.db_data_file.deleted_at,
        },
        items_data: {
          column_definitions: JSON.stringify(this.column_definitions),
          items: JSON.stringify(this.items),
        },
      };

      ipcRenderer.send("update_save_file", data_file);
      ipcRenderer.once("update_save_file_response", (event, data) => {
        this.showSaveDialog = false;
      });
    },
    onAddColumnDialogClosed(column_definition) {
      if ("data_type" in column_definition) {
        this.column_definitions.push(column_definition);

        if(this.rows.length>0){
          for(let i=0; i<this.rows.length;i++){
            this.rows[i].columns.push({
              name: column_definition.name,
              value: i==0 ? column_definition.name : ""
            });
          }
        }
      }
      this.showAddColumnDialog = false;
    },
    onAddRecordDialogClosed(row_data) {
      if (row_data.length > 0) {


        const columns = [];

        for(let i=0; i<row_data.length;i++){

          columns.push({
            name:row_data[i].column,
            value:row_data[i].value
          });
        }

        this.rows.push({
          _id:uuidv4(),
          columns:columns
        });
      }
      this.showAddRecordDialog = false;
    },

    onPressedShowDialogAddColumn() {
      this.showAddColumnDialog = true;
    },
    onPressedShowDialogAddRecord() {
      this.showAddRecordDialog = true;
    },
    dbGetDataFile(id) {
      this.db_data_file = null;
      ipcRenderer.send("db_datafiles_get_where_id", id);
      ipcRenderer.once("db_datafiles_get_where_id_response", (event, data) => {
        // A fix for VUEjs coz it receiveds data as a reactive observable instead of data object
        this.db_data_file = JSON.parse(JSON.stringify(data));

        this.fsGetFileContents(data.file_path);
      });
    },

    fsGetFileContents(path) {
      this.column_definitions = [];
      this.items = [];
      ipcRenderer.send("load_data_file_where_path", path);
      ipcRenderer.once("load_data_file_where_path_response", (event, data) => {
        const file = JSON.parse(data);

        this.column_definitions = JSON.parse(
          file.items_data.column_definitions
        );
        if (this.column_definitions.length > 0) {
          const columns = [];
          for (let i = 0; i < this.column_definitions.length; i++) {
            const column_def = this.column_definitions[i];
            columns.push({
              name: column_def.name,
              value: column_def.name,
            });
          }
          this.rows.push({
            _id: "headers",
            columns: columns,
          });
        }

        if (JSON.stringify(file.items_data.items) !== "[]") {
          this.items = JSON.parse(file.items_data.items);
        }
      });
    },
  },
};
</script>

<style lang="scss">
.gray-color {
  color: rgb(175, 175, 175);
}
hr {
  border: none;
  border-bottom: 1px solid #ccc;
}
.data-file-table {
  .headerClass{
    color:white;
    background-color: rgb(56, 56, 56)!important;
  }
  tr {
    td {
      border: 1px solid #ccc;
      padding: 3px 10px;
      background-color: #fff;
    }
  }
}
</style>