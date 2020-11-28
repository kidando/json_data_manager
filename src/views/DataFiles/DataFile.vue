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
        <div>
          <v-btn
            class="mr-2"
            @click="onPressedShowDialogAddColumn"
            elevation="0"
            color="primary"
            ><i class="fas fa-columns mr-2"></i>Add Column</v-btn
          >
          <v-btn
            @click="onPressedShowDialogEditColumns"
            class="ml-1 mr-1"
            elevation="0"
            color="primary"
            ><i class="fas fa-edit mr-2"></i>Edit Columns</v-btn
          >
          <v-btn
            @click="onPressedShowDialogAddRecord"
            v-if="column_definitions.length > 0"
            elevation="0"
            color="primary"
            class="ml-2"
            ><i class="fas fa-plus mr-2"></i> Insert Record</v-btn
          >
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            <v-text-field
              v-model="df_search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="df_headers"
            :items="df_rows"
            :search="df_search"
          >
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editRow(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteRow(item)"> mdi-delete </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <AddDataFileColumnDialog
      @addColumnDialogClosed="onAddColumnDialogClosed"
      :showAddColumnDialog="showAddColumnDialog"
      :data_types="data_types"
    ></AddDataFileColumnDialog>

    <DataFileRecordDialog
      @addRecordDialogClosed="onRecordDialogClosed"
      :showRecordDialog="showRecordDialog"
      :column_definitions="column_definitions"
      :action="action"
      :row_data="row_data"
      v-if="showRecordDialog"
    >
    </DataFileRecordDialog>

    <EditDataFileColumnsDialog
      @columnUpdated="onColumnUpdated"
      :data_types="data_types"
      :column_definitions="column_definitions"
      @editColumnsDialogClosed="onEditColumnsDialogClosed"
      :show="showEditColumnsDialog"
    >
    </EditDataFileColumnsDialog>

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

    <v-dialog v-model="showDialogConfirmDeleteRow" persistent max-width="290">
      <v-card>
        <v-card-title class="headline"> Confirm Delete </v-card-title>
        <v-card-text>Are you sure you want to delele this row?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            text
            @click="showDialogConfirmDeleteRow = false"
          >
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="onPressedConfirmDeleteRow">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" timeout="3000" color="green" right top>
      {{ snackbar_text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import AddDataFileColumnDialog from "../../components/DataFiles/AddDataFileColumnDialog";
import DataFileRecordDialog from "../../components/DataFiles/DataFileRecordDialog";
import EditDataFileColumnsDialog from "../../components/DataFiles/EditDataFileColumnsDialog";
import { v4 as uuidv4 } from "uuid";
const dayjs = require("dayjs");
const { ipcRenderer } = require("electron");
export default {
  name: "DataFile",
  components: {
    AddDataFileColumnDialog,
    DataFileRecordDialog,
    EditDataFileColumnsDialog,
  },

  data: () => ({
    showAddColumnDialog: false,
    showRecordDialog: false,
    db_data_file: null,
    column_definitions: [],
    showSaveDialog: false,
    display_rows: [],
    rows: [],
    df_headers: [],
    df_rows: [],
    df_search: "",
    delete_item: null,
    showDialogConfirmDeleteRow: false,
    action: "",
    row_data: null,
    showEditColumnsDialog: false,
    data_types: ["Boolean", "Number", "String"],
    snackbar: false,
    snackbar_text: "",
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
    onColumnUpdated(column_def) {
      const _column_definitions = [];

      for (let i = 0; i < this.column_definitions.length; i++) {
        if (column_def.old_column_name == this.column_definitions[i].name) {
          _column_definitions.push({
            name: column_def.name,
            data_type: column_def.data_type,
            default_value: column_def.default_value,
          });
        } else {
          _column_definitions.push({
            name: this.column_definitions[i].name,
            data_type: this.column_definitions[i].data_type,
            default_value: this.column_definitions[i].default_value,
          });
        }
      }
      this.column_definitions = _column_definitions;

      const _rows = [];

      for (let i = 0; i < this.rows.length; i++) {
        if (i == 0) {
          const row_columns = this.rows[i].columns;
          const _columns = [];
          for (let j = 0; j < row_columns.length; j++) {
            if (row_columns[j].name == column_def.old_column_name) {
              _columns.push({
                name: column_def.name,
                value: column_def.name,
              });
            } else {
              _columns.push({
                name: row_columns[j].name,
                value: row_columns[j].value,
              });
            }
          }
          _rows.push({
            _id: this.rows[i]._id,
            columns: _columns,
          });
        } else {
          const row_column = this.rows[i].columns;
          const _columns = [];

          for (let i = 0; i < row_column.length; i++) {
            if (row_column[i].name == column_def.old_column_name) {
              _columns.push({
                name: column_def.name,
                value: row_column[i].value,
              });
            } else {
              _columns.push({
                name: row_column[i].name,
                value: row_column[i].value,
              });
            }
          }
          _rows.push({
            _id: this.rows[i]._id,
            columns: _columns,
          });
        }
      }
      this.rows = _rows;
      this.updateTableColumnsAndRows();
      this.snackbar = true;
      this.snackbar_text = "Column Updated";
    },
    onPressedShowDialogEditColumns() {
      this.showEditColumnsDialog = true;
    },
    onEditColumnsDialogClosed() {
      this.showEditColumnsDialog = false;
    },
    editRow(row) {
      this.action = "edit";
      this.showRecordDialog = true;
      this.row_data = row;
    },
    onPressedConfirmDeleteRow() {
      for (let i = 0; i < this.df_rows.length; i++) {
        if (this.df_rows[i] == this.delete_item) {
          this.df_rows.splice(i, 1);
          break;
        }
      }

      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i]._id == this.delete_item._id) {
          this.rows.splice(i, 1);
          break;
        }
      }

      this.showDialogConfirmDeleteRow = false;
    },
    deleteRow(row) {
      this.delete_item = row;
      this.showDialogConfirmDeleteRow = true;
    },
    evaluateTdClass(row_index) {
      if (row_index == 0) return "headerClass";
      return "";
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
          column_definitions: this.column_definitions,
          rows: this.rows,
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

        if (this.rows.length > 0) {
          for (let i = 0; i < this.rows.length; i++) {
            this.rows[i].columns.push({
              name: column_definition.name,
              value: i == 0 ? column_definition.name : "",
            });
          }
        } else {
          this.rows.push({
            _id: "column-headers",
            columns: [
              {
                name: column_definition.name,
                value: column_definition.name,
              },
            ],
          });
        }
      }
      this.updateTableColumnsAndRows();
      this.showAddColumnDialog = false;
    },
    onRecordDialogClosed(response) {
      if ("action" in response) {
        if (response.action == "edit") {
          const _rows = [];
          for (let i = 0; i < this.rows.length; i++) {
            if (this.rows[i]._id == response.row_id) {
              const columns = [];

              for (let i = 0; i < response.row_data.length; i++) {
                columns.push({
                  name: response.row_data[i].column,
                  value: response.row_data[i].value,
                });
              }

              _rows.push({
                _id: response.row_id,
                columns: columns,
              });
            } else {
              _rows.push({
                _id: this.rows[i]._id,
                columns: this.rows[i].columns,
              });
            }
          }
          this.rows = _rows;
        } else {
          const columns = [];

          for (let i = 0; i < response.row_data.length; i++) {
            columns.push({
              name: response.row_data[i].column,
              value: response.row_data[i].value,
            });
          }

          this.rows.push({
            _id: uuidv4(),
            columns: columns,
          });
        }
      }
      this.updateTableColumnsAndRows();
      this.showRecordDialog = false;
    },

    onPressedShowDialogAddColumn() {
      this.showAddColumnDialog = true;
    },
    onPressedShowDialogAddRecord() {
      this.action = "add";
      this.showRecordDialog = true;
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

    updateTableColumnsAndRows() {
      this.df_headers = [];
      this.df_rows = [];
      for (let i = 0; i < this.rows[0].columns.length; i++) {
        const header = this.rows[0].columns[i];

        this.df_headers.push({
          value: this.rows[0].columns[i].name,
          text: this.rows[0].columns[i].name,
        });
      }

      this.df_headers.push({
        value: "actions",
        text: "Actions",
      });

      for (let i = 0; i < this.rows.length; i++) {
        if (i != 0) {
          const row = this.rows[i];
          const row_object = {};

          for (let j = 0; j < row.columns.length; j++) {
            const column = row.columns[j];

            for (let k = 0; k < this.df_headers.length; k++) {
              if (this.df_headers[k].value == column.name) {
                row_object[column.name] = column.value;
              }
            }
          }
          row_object["_id"] = row._id;

          this.df_rows.push(row_object);
        }
      }
    },

    fsGetFileContents(path) {
      this.column_definitions = [];
      this.rows = [];
      ipcRenderer.send("load_data_file_where_path", path);
      ipcRenderer.once("load_data_file_where_path_response", (event, data) => {
        const file = JSON.parse(data);

        this.column_definitions = file.items_data.column_definitions;
        this.rows = file.items_data.rows;
        //this.updateTableColumnsAndRows();
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
  .headerClass {
    color: white;
    background-color: rgb(56, 56, 56) !important;
    text-align: center;
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