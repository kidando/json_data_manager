'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog, Menu } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
require('@electron/remote/main').initialize()
const dayjs = require('dayjs')

const isDevelopment = process.env.NODE_ENV !== 'production'
const fs = require('fs');
const path = require('path')
const Datastore = require('nedb-promises')
const dbPath = path.resolve(__dirname, './data_file.db')
let data_file_model = Datastore.create('./src/models/data_files.db')
let system_settings_model = Datastore.create('./src/models/system_settings.db')
let gblSettings = {};



// SYSTEM SETTINGS OPTIONS
ipcMain.on('get_system_prferences', (event:any) => {
  getSystemSettings().then(response => {
    if (win !== null) {
      win.webContents.send('get_system_prferences_response', response);
    }
  }).catch(error => {
    console.log(error);
  });
});

ipcMain.on('on_preferences_updated', (event:any, data:any) => {
  getSystemSettings().then(response => {
    if ('name' in gblSettings) {
      system_settings_model.update({ name: 'settings' }, data).then((response: any) => {
        if (win !== null) {
          win.webContents.send('on_preferences_updated_success');
        }
      }).catch((error: any) => {
        console.log(error);
      });

    } else {
      // Create
      system_settings_model.insert(data)
        .then((response: any) => {
          console.log(response);
          if (win !== null) {
            win.webContents.send('on_preferences_updated_success');
          }
        }).catch((err: any) => {
          console.log(err);
        });

    }
  }).catch(error => {
    console.log(error);
  });
});



// DATA FILE LOADING
// Get single data file
ipcMain.on('db_datafiles_get_where_id', (event: any, id:any) => {
  data_file_model.findOne({ '_id': id }).then((response: any) => {
    if (win !== null) {
      win.webContents.send('db_datafiles_get_where_id_response', response);
    }
  }).catch((error: any) => {
    console.log(error);
  });
});

// Get all data files
ipcMain.on('db_datafiles_get_all', (event: any) => {
  data_file_model.find().then((response: any) => {
    if (win !== null) {
      win.webContents.send('db_datafiles_get_all_response', response);
    }
  }).catch((error: any) => {
    console.log(error);
  });
});




// DATA FILE SAVE LOAD
// Update data file
ipcMain.on('update_save_file', (event: any, data_file:any) => {
  updateDataFile(data_file).then(response => {
    if (win !== null) {
      win.webContents.send('update_save_file_response', response);
    }
  }).catch(error => {
    console.log(error);
  });

});

// Save data file
ipcMain.on('save_file_dialog', (event: any, fileinfo:any) => {

  dialog.showSaveDialog({
    title: "Select Save Location",
    defaultPath: fileinfo.proposed_filename,
    filters: [
      { name: 'JSON', extensions: ['json'] }
    ]
  }).then(response => {
    if (response.canceled) {
      if (win !== null) {
        win.webContents.send('save_file_dialog_response', 'cancelled');
      }
    } else {
      let now = dayjs();
      let result = {
        jdm_data: {
          name: fileinfo.name,
          file_path: response.filePath,
          created_at: now.format('YYYY-MM-DD HH:mm:ss'),
          updated_at: now.format('YYYY-MM-DD HH:mm:ss'),
          deleted_at: ""
        },
        items_data: {
          column_definitions: [],
          rows: []
        }

      };
      fs.writeFile(response.filePath, JSON.stringify(result), function (err: any) {
        if (err) throw err;
        const db_datafile = {
          name: result.jdm_data.name,
          file_path: result.jdm_data.file_path,
          created_at: result.jdm_data.created_at,
          updated_at: result.jdm_data.updated_at,
          deleted_at: result.jdm_data.deleted_at
        };
        data_file_model.insert(db_datafile)
          .then((response: any) => {

            if (win !== null) {
              win.webContents.send('save_file_dialog_response', response);
            }
          }).catch((err: any) => {
            console.log(err);
          });


      });

    }
  });


});


// Load data file
ipcMain.on('load_data_file_where_path', (event: any, filepath) => {
  fs.readFile(filepath, 'utf8', (err: any, fileContets: any) => {
    if (err) {
      console.error(err)
      return
    }
    if (win !== null) {
      win.webContents.send('load_data_file_where_path_response', fileContets);
    }
  })
});


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

function appMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Preferences',
          click: function () {
            if (win != null) {
              win.webContents.send('on_menu_preferences_clicked');
            }
          }
        },
        { role: 'quit' }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);
}

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 600,
    minHeight: 300,
    title: "JSON Data Manager",
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      enableRemoteModule: true
    }
  })







  win.webContents.on('did-finish-load', function () {
    if (win !== null) {
      win.setTitle("JSON Data Manager");
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
    appMenu();
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }

  createWindow();
  appMenu();
  getSystemSettings();

})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

const updateDataFile = (data_file: any) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(data_file.jdm_data.file_path, JSON.stringify(data_file), function (err: any) {
      if (err) throw err;

      const db_datafile = {
        _id: data_file._id,
        name: data_file.jdm_data.name,
        file_path: data_file.jdm_data.file_path,
        created_at: data_file.jdm_data.created_at,
        updated_at: data_file.jdm_data.updated_at,
        deleted_at: data_file.jdm_data.deleted_at
      };

      data_file_model.update({ _id: data_file._id }, db_datafile).then((response: any) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error)
      });


    });
  });
};

const getSystemSettings = () => {
  return new Promise((resolve, reject) => {
    system_settings_model.find().then((response: any) => {

      for (let i = 0; i < response.length; i++) {
        gblSettings = response[0];
        break;
      }
      resolve(gblSettings);
    }).catch((error: any) => {
      reject(error);
    });
  });
};
