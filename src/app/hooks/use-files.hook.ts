import { useState, useEffect } from 'react';
import { FileEntityAttributes, FileEntityCreationAttributes, ObjectType, SubType } from '../../database/models/files.model';
import { FileFile } from '@/@types/file-type.type';

interface FileUploadData {
  buffer: ArrayBuffer;
  filename: string;
  mimeType: string;
}

interface FileOperationResult<T = any> {
  success: boolean;
  result?: T;
  error?: string;
}

interface FileWithId extends FileEntityAttributes {
  id: number;
}

export const useFiles = () => {
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unpublishBySubType = async (objectType: ObjectType, objectId: number, subType: SubType, subId?: number) => {
    setLoading(true);
    setError(null);

    try {
    const result = await electron.ipcRenderer.invoke('file:unpublish', objectType, objectId, subType, subId);

    // if (result.success) {
    // 
    // }
    
    return result;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Upload failed';
    setError(errorMessage);

    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
  };

  // Upload file
  const uploadFile = async (fileData: FileUploadData, metadata?: Partial<FileEntityCreationAttributes>): Promise<FileOperationResult<FileWithId>> => {
    setLoading(true);
    setError(null);

    try {
      const result = await electron.ipcRenderer.invoke('file:upload', fileData, metadata || {});
      
      if (result.success) {
        // Refresh file list
        await loadImages();
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Load all image files
  const loadImages = async (): Promise<FileOperationResult<FileWithId[]>> => {
    setLoading(true);
    setError(null);

    try {
      const result = await electron.ipcRenderer.invoke('file:findImages');
      
      if (result.success) {
        setFiles(result.result || []);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load images';
      setError(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Search files
  const searchFiles = async (query: string): Promise<FileOperationResult<FileWithId[]>> => {
    setLoading(true);
    setError(null);

    try {
      const result = await electron.ipcRenderer.invoke('file:search', query);
      
      if (result.success) {
        setFiles(result.result || []);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Find file by ID
  const findFileById = async (id: number): Promise<FileOperationResult<FileWithId>> => {
    setLoading(true);
    setError(null);

    try {
      const result = await electron.ipcRenderer.invoke('file:findById', id);

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to find file';
      setError(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Get file absolute path
  const getFileAbsolutePath = async (urlOrID: number | string): Promise<FileOperationResult<string>> => {
    try {
      const result = await electron.ipcRenderer.invoke('file:getAbsolutePath', urlOrID);

      return { success: true, result: result.result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get file path';

      return { success: false, error: errorMessage };
    }
  };

  // Get file as data URL for renderer process
  const getFileDataURL = async (fileType: FileFile): Promise<FileOperationResult<string>> => {
    try {
      const result = await electron.ipcRenderer.invoke('file:getDataURL', fileType);

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get file data URL';

      return { success: false, error: errorMessage };
    }
  };

  // Delete file
  const deleteFile = async (id: number): Promise<FileOperationResult<boolean>> => {
    setLoading(true);
    setError(null);

    try {
      const result = await electron.ipcRenderer.invoke('file:delete', id);
      
      if (result.success) {
        // Remove from local state
        setFiles(prev => prev.filter(f => f.id !== id));
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete file';
      setError(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update file
  const updateFile = async (id: number, data: Partial<FileEntityCreationAttributes>): Promise<FileOperationResult<FileWithId>> => {
    setLoading(true);
    setError(null);

    try {
      const result = await electron.ipcRenderer.invoke('file:update', id, data);
      
      if (result.success && result.result) {
        // Update in local state
        setFiles(prev => prev.map(f => f.id === id ? result.result : f));
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update file';
      setError(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getFonts = async (generatorId?: number) => {
    const result = await electron.ipcRenderer.invoke('file:findFonts', generatorId);

    return result;
  };

  return {
    files,
    loading,
    error,
    uploadFile,
    loadImages,
    searchFiles,
    findFileById,
    getFileAbsolutePath,
    getFileDataURL,
    deleteFile,
    updateFile,
    unpublishBySubType,
    clearError: () => setError(null),
  };
};

// Hook for single file operations
export const useFile = (id?: number) => {
  const [file, setFile] = useState<FileWithId | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFile = async (fileId: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await electron.ipcRenderer.invoke('file:findById', fileId);
      
      if (result.success) {
        setFile(result.result);
      } else {
        setError(result.error || 'Failed to load file');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load file';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadFile(id);
    }
  }, [id]);

  return {
    file,
    loading,
    error,
    loadFile,
    clearError: () => setError(null),
  };
}; 
