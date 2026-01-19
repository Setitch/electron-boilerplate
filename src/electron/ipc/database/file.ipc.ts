import type { IpcMain } from 'electron';
import { DatabaseService } from '../../../database/database.service';
import { FileStorageService } from '../../services/file-storage.service';
import { FileEntityCreationAttributes, ObjectType, SubType } from '../../../database/models/files.model';

export const registerFileIPC = (ipcMain: IpcMain) => {
  // Upload file
  ipcMain.handle('file:upload', async (_, fileData: { buffer: ArrayBuffer; filename: string } & Partial<FileEntityCreationAttributes>, metadata: Partial<FileEntityCreationAttributes>) => {
    try {
 console.log({ fileData, buffer: null });
      const buffer = Buffer.from(fileData.buffer);
      // Save file to storage
      const { url, hash, size } = await FileStorageService.saveFile(buffer, fileData.filename);
      
      // Create file record in database
      const fileRecord = await DatabaseService.createFile({
        name: fileData.filename,
        url,
        hash,
        storageType: 'local',
        storageSettings: {},
        mimeType: fileData.mimeType,
        size,
        typeSimplified: 'image',
        objectType: metadata.objectType || 'system',
        objectId: metadata.objectId || null,
        subType: metadata.subType || null,
        subId: metadata.subId || null,
        isPublished: true,
        generationMeta: metadata.generationMeta || null,
        dimensions: null,
      });

      
      // TODO: eventEmitter2, emit the relativePath and fileRecord (await for that emit). And let the main process to use sharpjs to make some image processing.
      // SETI TODO: That is important

      return { success: true, result: fileRecord.get({ plain: true }) };
    } catch (error) {
      console.error('File upload error:', error);

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  ipcMain.handle('file:findFonts', async (_, generatorId?: number) => {
    try {
      const fonts = await DatabaseService.findFonts(generatorId);

      return { success: true, result: fonts.map(f => f.get({ plain: true })) };
    } catch (error) {
      console.error('Find fonts error:', error);

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // Find file by ID
  ipcMain.handle('file:findById', async (_, id: number) => {
    try {
      const file = await DatabaseService.findFileById(id);

      return { success: true, result: file ? file.toJSON() : null };
    } catch (error) {
      console.error('Find file by ID error:', error);

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // unpublish file by subType
  ipcMain.handle('file:unpublish', async (_, objectType: ObjectType, objectId: number, subType: SubType, subId: number) => {
    try {
      const result = await DatabaseService.unpublishFile(objectType, objectId, subType, subId);

      return { success: true, result };
    } catch (error) {
      console.error('Unpublish file error:', error);

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // Find image files
  ipcMain.handle('file:findImages', async (_, searchOptions: { query?: string; objectType?: ObjectType; objectId?: number; subType?: SubType; subId?: number }) => {
    try {
      const files = await DatabaseService.findImageFiles(searchOptions);

      return { success: true, result: files.map(f => f.get({ plain: true })) };
    } catch (error) {
      console.error('Find image files error:', error);

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // Update file
  ipcMain.handle('file:update', async (_, id: number, data: Partial<FileEntityCreationAttributes>) => {
    try {
      const file = await DatabaseService.updateFile(id, data);

      return { success: true, result: file ? file.get({ plain: true }) : null };
    } catch (error) {
      console.error('Update file error:', error);

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // Delete file
  ipcMain.handle('file:delete', async (_, id: number) => {
    try {
      // Get file info first
      const file = await DatabaseService.findFileById(id);
      if (!file) {
        return { success: false, error: 'File not found' };
      }

      // Delete from database
      const result = await DatabaseService.deleteFile(id);

      // Delete from storage
      await FileStorageService.deleteFile(file.url);
      
      return { success: true, result };
    } catch (error) {
      console.error('Delete file error:', error);

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // Get file absolute path for local access
  ipcMain.handle('file:getAbsolutePath', async (_, urlOrId: string | number) => {
    try {
      const absolutePath = await FileStorageService.getAbsolutePath(urlOrId);

      return { success: true, result: absolutePath };
    } catch (error) {
      console.error('Get absolute path error:', error);

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // Get file as data URL for renderer process
  ipcMain.handle('file:getDataURL', async (_, fileType: FileFile) => {
    if ((fileType as any)?.desc || (fileType as any)?.path) {
      return { success: false, error: 'Not yet supported' };
    } else if ((fileType as any)?.url) {
      return { success: true, result: (fileType as any).url };
    }
    
    const urlOrId = (fileType as any)?.id || fileType as string|number;
    
    try {
      const fileBuffer = await FileStorageService.getFileBuffer(urlOrId);
      if (!fileBuffer) {
        return { success: false, error: 'File not found' };
      }

      // Get file info to determine MIME type
      let file = null;
      file = await (typeof urlOrId === 'number' ? DatabaseService.findFileById(urlOrId) : DatabaseService.findFileByUrl(urlOrId));

      const mimeType = file?.mimeType || 'application/octet-stream';
      const base64 = fileBuffer.toString('base64');
      const dataURL = `data:${mimeType};base64,${base64}`;

      return { success: true, result: dataURL };
    } catch (error) {
      console.error('Get data URL error:', error);

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // Check if file exists
  ipcMain.handle('file:exists', async (_, url: string) => {
    try {
      const exists = await FileStorageService.fileExists(url);

      return { success: true, result: exists };
    } catch (error) {
      console.error('Check file exists error:', error);

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });
}; 
