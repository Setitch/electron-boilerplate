import { BrowserWindow, app } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import squirrelStartup from 'electron-squirrel-startup';

import { createAppWindow } from './electron/app-window';
import { setupDatabaseIPC } from './electron/ipc/database.ipc';
import { DatabaseService } from './database/database.service';
import { registerStoreIPC } from './electron/ipc/store.ipc';
import { FileStorageService } from './electron/services/file-storage.service';

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

/** Handle creating/removing shortcuts on Windows when installing/uninstalling. */
if (squirrelStartup) {
  app.quit();
}

app.whenReady().then(async () => {
  // Initialize database
  try {
    await DatabaseService.initialize();
    setupDatabaseIPC();
    console.log('Database and IPC handlers initialized');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }

  // Initialize file storage
  try {
    await FileStorageService.initialize();
    console.log('File storage initialized');
  } catch (error) {
    console.error('Failed to initialize file storage:', error);
  }

  try {
    await registerStoreIPC();
    console.log('Store IPC handlers initialized');
  } catch (error) {
    console.error('Failed to initialize store:', error);
  }

  // TODO: add registering IPC handlers here


  installExtension(REACT_DEVELOPER_TOOLS)
    .then((extension) => console.info(`Added Extension:  ${extension.name}`))
    .catch((err) => console.info('An error occurred: ', err));
});

/**
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
app.on('ready', createAppWindow);

/**
 * Emitted when the application is activated. Various actions can
 * trigger this event, such as launching the application for the first time,
 * attempting to re-launch the application when it's already running,
 * or clicking on the application's dock or taskbar icon.
 */
app.on('activate', () => {
  /**
   * On OS X it's common to re-create a window in the app when the
   * dock icon is clicked and there are no other windows open.
   */
  if (BrowserWindow.getAllWindows().length === 0) {
    createAppWindow();
  }
});

/**
 * Emitted when all windows have been closed.
 */
app.on('window-all-closed', () => {
  /**
   * On OS X it is common for applications and their menu bar
   * to stay active until the user quits explicitly with Cmd + Q
   */
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async () => {
  // Close database connection before quitting
  await DatabaseService.close();
});

/**
 * In this file you can include the rest of your app's specific main process code.
 * You can also put them in separate files and import them here.
 */
