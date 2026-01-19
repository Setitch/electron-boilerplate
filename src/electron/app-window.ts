import path from 'node:path';

import { registerMenuIpc } from '@/electron/ipc/menu.ipc';
import appMenu from '@/electron/menu/app-menu';
import { registerWindowStateChangedEvents } from '@/electron/window-state';

import { BrowserWindow, Menu, app } from 'electron';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

// Get the directory name for CommonJS compatibility
const __dirname = process.cwd();

let appWindow: BrowserWindow;

interface WindowState {
  x: number;
  y: number;
  width: number;
  height: number;
  isMaximized: boolean;
}

function loadWindowState(): WindowState {
  const statePath = path.join(app.getPath('userData'), 'window-state.json');
  
  try {
    if (existsSync(statePath)) {
      const data = readFileSync(statePath, 'utf8');

      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Failed to load window state:', error);
  }
  
  // Default state
  return {
    x: undefined,
    y: undefined,
    width: 970,
    height: 660,
    isMaximized: false,
  };
}

function saveWindowState(window: BrowserWindow) {
  // Check if window is still valid and not destroyed
  if (!window || window.isDestroyed()) {
    console.warn('Cannot save window state: window is null or destroyed');

    return;
  }

  const statePath = path.join(app.getPath('userData'), 'window-state.json');
  
  try {
    const bounds = window.getBounds();
    const isMaximized = window.isMaximized();
    
    // Additional check for bounds validity
    if (!bounds || typeof bounds.x !== 'number' || typeof bounds.y !== 'number' || 
        typeof bounds.width !== 'number' || typeof bounds.height !== 'number') {
      console.warn('Cannot save window state: invalid bounds');

      return;
    }
    
    const state: WindowState = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      isMaximized,
    };
    
    writeFileSync(statePath, JSON.stringify(state, null, 2));
  } catch (error) {
    console.warn('Failed to save window state:', error);
  }
}

/**
 * Create Application Window
 * @returns { BrowserWindow } Application Window Instance
 */
export function createAppWindow(): BrowserWindow {
  const minWidth = 960;
  const minHeight = 660;
  const savedState = loadWindowState();

  const windowOptions: Electron.BrowserWindowConstructorOptions = {
    x: savedState.x,
    y: savedState.y,
    width: savedState.width,
    height: savedState.height,
    minWidth,
    minHeight,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    backgroundColor: '#1a1a1a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      preload: path.join(__dirname, '.rsbuild/preload/preload.cjs'),
    },
  };

  if (process.platform === 'darwin') {
    windowOptions.titleBarStyle = 'hidden';
  }

  // Create new window instance
  appWindow = new BrowserWindow(windowOptions);

  // Load the index.html of the app window.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    appWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    appWindow.loadFile(
      path.join(__dirname, '.rsbuild/renderer/main_window/index.html'),
    );
  }

  // Build the application menu
  const menu = Menu.buildFromTemplate(appMenu);
  Menu.setApplicationMenu(menu);

  // Show window when is ready to
  appWindow.on('ready-to-show', () => {
    appWindow.show();
    
    // Restore maximized state if it was saved
    if (savedState.isMaximized) {
      appWindow.maximize();
    }
  });

  // Register Inter Process Communication for main process
  registerMainIPC();

  // Save window state on close
  appWindow.on('close', () => {
    try {
      saveWindowState(appWindow);
    } catch (error) {
      console.warn('Error saving window state on close:', error);
    }
    appWindow = null;
    app.quit();
  });

  return appWindow;
}

/**
 * Register Inter Process Communication
 */
function registerMainIPC() {
  /**
   * Here you can assign IPC related codes for the application window
   * to Communicate asynchronously from the main process to renderer processes.
   */
  registerWindowStateChangedEvents(appWindow);
  registerMenuIpc(appWindow);
}
