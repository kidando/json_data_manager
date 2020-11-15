import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

// PROJECTS
import Projects from '../views/Projects.vue'

// DATA FILES
import DataFileAdd from '../views/DataFiles/DataFileAdd.vue'
import DataFiles from '../views/DataFiles/DataFiles.vue'
import DataFile from '../views/DataFiles/DataFile.vue'


// SETTINGS
//import SettingsLandingPage from '../views/Settings/SettingsLandingPage.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [

  // DATAFILES
  {
    path: '/',
    name: 'DataFiles',
    component: DataFiles
  },
  {
    path: '/data_file/:id',
    name: 'DataFile',
    component: DataFile
  }
]

const router = new VueRouter({
  routes
})

export default router
