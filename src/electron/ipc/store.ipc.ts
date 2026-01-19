import { ipcMain } from 'electron';
import Store from 'electron-store';

const store = new Store();

export const registerStoreIPC = () => {
     // Electron-store IPC handlers for query client persistence
  ipcMain.handle('store:get', async (_, key: string) => {
    try {
      const value = store.get(key);

      return { success: true, value };
    } catch (error) {
      console.error('Store get error:', error);

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  ipcMain.handle('store:set', async (_, key: string, value: any) => {
    try {
      store.set(key, value);

      return { success: true };
    } catch (error) {
      console.error('Store set error:', error);

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  ipcMain.handle('store:delete', async (_, key: string) => {
    try {
      store.delete(key);

      return { success: true };
    } catch (error) {
      console.error('Store delete error:', error);

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

};