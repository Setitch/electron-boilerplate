import { IpcMain, ipcMain } from 'electron';
import { DatabaseService } from '../../database/database.service';
import { registerFileIPC } from './database/file.ipc';

function registerModelsIPC(ipcMain: IpcMain): void {
  // TODO: Add other models here
  registerFileIPC(ipcMain);
}

export function setupDatabaseIPC(): void {
  // Initialize database
  ipcMain.handle('database:initialize', async () => {
    try {
      await DatabaseService.initialize();

      return { success: true };
    } catch (error) {
      console.error('Failed to initialize database:', error);

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // Raw SQL query
  ipcMain.handle('database:executeRawQuery', async (_, sql: string, replacements?: any) => {
    try {
      const result = await DatabaseService.executeRawQuery(sql, replacements);

      return { success: true, result };
    } catch (error) {
      console.error('Raw query error:', error);

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // Close database
  ipcMain.handle('database:close', async () => {
    try {
      await DatabaseService.close();
      
      return { success: true };
    } catch (error) {
      console.error('Database close error:', error);
      
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // Register models IPC - for each model
  registerModelsIPC(ipcMain);
} 