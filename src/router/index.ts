import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'


// DATA FILES
import DataFileAdd from '../views/DataFiles/DataFileAdd.vue'
import DataFiles from '../views/DataFiles/DataFiles.vue'
import DataFile from '../views/DataFiles/DataFile.vue'

// PROJECTS
import Projects from '../views/Projects/Projects.vue'


// SETTINGS
//import SettingsLandingPage from '../views/Settings/SettingsLandingPage.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [

  // DATAFILES
  {
    path: '/',
    name: 'DataFiles',
    component: DataFiles,
    meta:{
      title:"Data Files"
    }
  },
  {
    path: '/data_file/:id',
    name: 'DataFile',
    component: DataFile,
    meta:{
      title:"Data File Details"
    }
  },


  // PROJECTS
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
    meta:{
      title:"Projects"
    }
  },
]

const router = new VueRouter({
  routes
})

export default router
