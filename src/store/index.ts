import Vue from 'vue'
import Vuex from 'vuex'
const { ipcRenderer } = require("electron");

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    preferences:null
  },
  mutations: { 
    updatePreferences(state, payload){
      state.preferences = payload;
  }
  },
  actions: {
    getAppPreferences(context){
      ipcRenderer.send("get_system_prferences");
      ipcRenderer.on("get_system_prferences_response", (event, data) => {
          context.commit('updatePreferences',data);
        });
  }
  },
  getters:{

  }
})
