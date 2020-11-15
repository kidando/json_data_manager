<template>
  <v-container fluid>
    <div class="d-flex justify-space-between align-center">
      <div>
        <h2>{{ name }}</h2>
        <h5 class="text-uppercase gray-color font-weight-regular mb-2">
          {{ last_updated }}
        </h5>
      </div>
      <v-btn @click="onPressedDataFileSave" elevation="0" color="success"><i class="fas fa-save mr-2"></i> Save</v-btn>
    </div>
    <hr />
    <v-row>
      <v-col>
        <div class="mb-5">
          <v-btn
            class="mr-3"
            @click="onPressedShowDialogAddColumn"
            outlined
            color="primary"
            ><i class="fas fa-columns mr-2"></i>Add Column</v-btn
          >
          <v-btn
            v-if="column_definitions.length > 0"
            outlined
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
          <thead>
            <tr>
              <th style="widht: 1px"></th>
              <th v-for="(header, index) in column_definitions" :key="index">
                {{ header.name }}
              </th>
            </tr>
          </thead>
          <tbody v-if="items.lenth > 0">
            <tr v-for="(item, index) in items" :key="index"></tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td :colspan="column_definitions.length + 1" class="text-center">
                No Items set
              </td>
            </tr>
          </tbody>
        </table>
      </v-col>
    </v-row>
    <AddDataFileColumnDialog
      @dialogClosed="onDialogClosed"
      :showDialog="showAddColumnDialog"
    >
    </AddDataFileColumnDialog>


    <v-dialog
      v-model="showSaveDialog"
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
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
const dayjs = require('dayjs')
const { ipcRenderer } = require("electron");
export default {
  name: "DataFile",
  components: {
    AddDataFileColumnDialog,
  },

  data: () => ({
    showAddColumnDialog: false,
    data_file: null,
    data_file_contents: {},
    column_definitions: [],
    items: [],
    showSaveDialog: false,

  }),
  mounted() {
    this.getDataFile(this.$route.params.id);
  },
  computed: {
    name() {
      if (this.data_file != null) {
        return this.data_file.jdm_data.name;
      }

      return "Loading...";
    },
    last_updated() {
      if (this.data_file != null) {
        return "Last Updated: " + this.data_file.jdm_data.updated_at;
      }

      return "Loading...";
    },
  },
  methods: {
    onPressedDataFileSave(){
      const now = dayjs();
      this.showSaveDialog = true;
  
      const data_file_structure = {
        _id:this.data_file._id,
        jdm_data: {
          name: this.data_file.jdm_data.name,
          file_path: this.data_file.jdm_data.file_path,
          created_at: this.data_file.jdm_data.created_at,
          updated_at: now.format('YYYY-MM-DD HH:mm:ss'),
          deleted_at: this.data_file.jdm_data.deleted_at
        },
        items_data:{
          column_definitions:JSON.stringify(this.column_definitions),
          items:JSON.stringify(this.items)
        }
      };

      ipcRenderer.send("update_save_file", data_file_structure);
      ipcRenderer.once("update_save_file_response", (event, data) => {
        this.showSaveDialog = false;
      });
    },
    onDialogClosed(column_definition) {
      if ('data_type' in column_definition) {
        this.column_definitions.push(column_definition);
      }
      this.showAddColumnDialog = false;
    },

    onPressedShowDialogAddColumn() {
      this.showAddColumnDialog = true;
    },
    getDataFile(id) {
      this.data_file = null;
      ipcRenderer.send("db_datafiles_get_where_id", id);
      ipcRenderer.once("db_datafiles_get_where_id_response", (event, data) => {
       
        const d = JSON.stringify(data);
        const p = JSON.parse(d);
  
         this.data_file =  p;

        this.getFileContents(data.jdm_data.file_path);
      });
    },

    getFileContents(path) {
      this.data_file_contents = {};
      this.column_definitions = [];
      this.items = [];
      ipcRenderer.send("load_data_file_where_path", path);
      ipcRenderer.once("load_data_file_where_path_response", (event, data) => {

        
        const file = JSON.parse(data);
        console.log(file);
  

        this.column_definitions = JSON.parse(file.items_data.column_definitions);
        this.items = JSON.parse(file.items_data.items);
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
  thead {
    tr {
      th {
        background-color: #f2f2f2;
        border: 1px solid #ccc;
        padding: 3px 10px;
      }
    }
  }

  tbody {
    tr {
      td {
        border: 1px solid #ccc;
        padding: 3px 10px;
      }
    }
  }
}
</style>