const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');

const {
    controllerReadFiles
  } = require("./modules/files/readFiles.js");

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 550,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      
    },

  })

  mainWindow.loadFile(path.join(__dirname, './modules/principal/index.html'))
  mainWindow.removeMenu();

  // Insert controllers 
  controllerReadFiles;

}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

