<template>
  <div id="sidebar">
    <ul id="sidebar-list">
      <li>
        <a @click.prevent="createFile" href=""
          ><i class="fas fa-plus mr-2"></i> New Data File</a
        >
      </li>
      <li>
        <a @click.prevent="pushToLink('/projects')" href=""
          ><i class="fas fa-file-alt mr-2"></i> Projects</a
        >
      </li>
      <li>
        <a @click.prevent="pushToLink('/')" href=""
          ><i class="fas fa-file-alt mr-2"></i> Data Files</a
        >
      </li>
    </ul>
    <AddDataFileDialog
      @dialogClosed="onDialogClosed"
      :toggleShow="toggleShow"
    ></AddDataFileDialog>
  </div>
</template>

<script>
import AddDataFileDialog from "../DataFiles/AddDataFileDialog.vue";
import { mapGetters } from "vuex";
export default {
  name: "Sidebar",
  components: {
    AddDataFileDialog,
  },
  data: () => ({
    toggleShow: false,
    currentPage: "",
  }),
  computed: {},

  mounted() {
    this.currentPage = this.$store.getters.getCurrentPage;
    this._keyListener = function (e) {
      if (e.key === "n" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault(); // present "Save Page" from getting triggered.

        this.createFile();
      }
    };
    document.addEventListener("keydown", this._keyListener.bind(this));
  },
  methods: {
    onDialogClosed() {
      this.toggleShow = false;
    },
    createFile() {
      this.toggleShow = true;
    },
    pushToLink(url) {
      if (this.$route.path == url) {
        return;
      }
      this.$router.push(url);
    },
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this._keyListener);
  },
};
</script>

<style lang="scss">
#sidebar {
  background-color: #f2f2f2;
  border-right: 1px solid #ccc;
  height: 100vh;
  width: 230px;
  min-width: 230px;
  max-width: 230px;
}

#sidebar-list {
  margin: 0;
  padding: 0;
  li {
    list-style-type: none;
    a {
      display: block;
      text-decoration: none;
      color: black;
      padding: 5px 10px;
      &:hover {
        background-color: #546e7a;
        color: #fff;
      }
    }
  }
}
</style>