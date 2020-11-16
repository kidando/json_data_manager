import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    current_page: "/",
    title:"Current Title"
  },
  mutations: { // Sy
    setCurrentPage(state,payload){
      state.current_page = payload;
    }
  },
  actions: {
  },
  modules: {
  },
  getters:{
    getCurrentPage(state){
      return state.current_page;
    }
  }
})
