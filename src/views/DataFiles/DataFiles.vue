<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-layout child-flex>
          <v-card flat outlined :rounded="rounded">
            <v-card-title>
             
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              class="flatten_table"
    
              :loading="is_loading_data_files"
              :loading-text="loading_text"
              :headers="headers"
              :items="db_data_files"
              :search="search"
            >
              <template v-slot:item="{ item }">
                <tr @dblclick="onDoubleClickRow(item)">
                  <td>{{ item.name }}</td>
                  <td>{{ item.created_at }}</td>
                  <td>{{ item.updated_at }}</td>
                  <td class="truncate">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">{{ item.file_path }}</span>
                      </template>
                      <span>{{ item.file_path }}</span>
                    </v-tooltip>
                    
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </v-layout>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const { ipcRenderer } = require("electron");
export default {
  name: "DataFiles",
  data: () => ({
    rounded: false,
    search: "",
    headers: [
      {
        text: "Name",
        align: "start",
        value: "name",
      },
      { text: "Created", value: "created_at" },
      { text: "Last Modified", value: "updated_at" },
      { text: "Location", value: "file_path" },
    ],
    db_data_files: [],
    is_loading_data_files: true,
    loading_text: "Retrieving files...",
  }),
  mounted() {
    this.getDataFiles();
  },
  methods: {
    onDoubleClickRow(item) {
      this.$router.push(`/data_file/${item._id}`);
    },
    getDataFiles() {
      this.db_data_files = [];
      this.is_loading_data_files = true;
      this.loading_text = "Retrieving files...";
      ipcRenderer.send("db_datafiles_get_all");
      ipcRenderer.once("db_datafiles_get_all_response", (event, data) => {
        this.db_data_files = data;
        this.is_loading_data_files = false;

        if (data.length <= 0) {
          this.loading_text = "No files found";
        }
      });
    },
  },
};
</script>

<style lang="scss">
.truncate {
  max-width: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.v-data-table__wrapper {
  table {
    thead {
      tr {
        th {
          min-width: 200px;
        }
      }
    }
  }
}
</style>