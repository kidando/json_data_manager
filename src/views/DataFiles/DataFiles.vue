<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-layout child-flex>
          <v-card>
            <v-card-title>
              <v-toolbar-title>Data Files</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              @dblclick:row="onDoubleClickRow"
              :loading="is_loading_data_files"
              :loading-text="loading_text"
              :headers="headers"
              :items="data_files"
              :search="search"
            >
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
    search: "",
    headers: [
      {
        text: "Name",
        align: "start",
        value: "jdm_data.name",
      },
      { text: "Created", value: "jdm_data.created_at" },
      { text: "Last Modified", value: "jdm_data.updated_at" },
      { text: "Location", value: "jdm_data.file_path" },
    ],
    data_files: [],
    is_loading_data_files: true,
    loading_text: "Retrieving files...",
  }),
  mounted() {
    this.getDataFiles();
  },
  methods: {
    onDoubleClickRow(event, data) {
      this.$router.push(`/data_file/${data.item._id}`);
    },
    getDataFiles() {
      this.data_files = [];
      this.is_loading_data_files = true;
      this.loading_text = "Retrieving files...";
      ipcRenderer.send("db_datafiles_get_all");
      ipcRenderer.once("db_datafiles_get_all_response", (event, data) => {
        this.data_files = data;
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
.v-data-table__wrapper{
   table{
        thead{
            tr{
                th{
                    min-width: 200px;
                }
            }

    }
   }
}
</style>