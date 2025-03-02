import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import loadConfig from '../config';
import logger from '../logger';

let mainWindow: BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle IPC calls
ipcMain.handle('load-config', async (event, customConfigPath) => {
  const config = loadConfig({ config: customConfigPath });
  return config;
});

ipcMain.handle('log-message', (event, level, message) => {
  logger[level](message);
});
