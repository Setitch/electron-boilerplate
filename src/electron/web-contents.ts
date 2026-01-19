import { MenuChannels } from '@/consts/menu-channels.const';

import type { WebContents } from 'electron';

export type ClickHandler = (
  menuItem: Electron.MenuItem,
  browserWindow: Electron.BrowserWindow | undefined,
  event: Electron.KeyboardEvent,
) => void;

export function emitEvent(eventName: string, ...args: unknown[]): ClickHandler {

  return (_, focusedWindow, event) => {
    const mainWindow = focusedWindow ?? Electron.BrowserWindow.getAllWindows()[0];
    if (mainWindow !== undefined) {

      // this will invoke MENU_EVENT on App.tsx
      sendToRenderer(mainWindow.webContents, MenuChannels.MENU_EVENT, eventName, ...args);
    }
  };
}

export function sendToRenderer(webContents: WebContents, channel: string, ...args: unknown[]): void {
  if (webContents.isDestroyed()) {
    const msg = `failed to send on ${channel}, webContents was destroyed`;
    if (__DEV__) {
      throw new Error(msg);
    }
    console.error(msg);
  } else {
    console.info('sendToRenderer', channel, args);
    webContents.send(channel, ...args);
  }
}
