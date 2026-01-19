import { useCallback } from 'react';

interface DatabaseResult<T = any> {
  success: boolean;
  result?: T;
  error?: string;
}

interface ExampleData {
  name: string;
  description?: string;
  isActive?: boolean;
}

interface ExampleRecord {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DatabaseHook {
  // Example model operations
  createExample: (data: ExampleData) => Promise<DatabaseResult<ExampleRecord>>;
  findAllExamples: () => Promise<DatabaseResult<ExampleRecord[]>>;
  findExampleById: (id: number) => Promise<DatabaseResult<ExampleRecord | null>>;
  updateExample: (id: number, data: Partial<ExampleData>) => Promise<DatabaseResult<ExampleRecord | null>>;
  deleteExample: (id: number) => Promise<DatabaseResult<boolean>>;
  
  // Raw SQL operations
  executeRawQuery: (sql: string, replacements?: any) => Promise<DatabaseResult>;
}

export function useDatabase(): DatabaseHook {
  const createExample = useCallback(async (data: ExampleData): Promise<DatabaseResult<ExampleRecord>> => {
    try {
      const result = await window.electron.ipcRenderer.invoke('database:createExample', data);

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }, []);

  const findAllExamples = useCallback(async (): Promise<DatabaseResult<ExampleRecord[]>> => {
    try {
      const result = await window.electron.ipcRenderer.invoke('database:findAllExamples');

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }, []);

  const findExampleById = useCallback(async (id: number): Promise<DatabaseResult<ExampleRecord | null>> => {
    try {
      const result = await window.electron.ipcRenderer.invoke('database:findExampleById', id);

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }, []);

  const updateExample = useCallback(async (id: number, data: Partial<ExampleData>): Promise<DatabaseResult<ExampleRecord | null>> => {
    try {
      const result = await window.electron.ipcRenderer.invoke('database:updateExample', id, data);

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }, []);

  const deleteExample = useCallback(async (id: number): Promise<DatabaseResult<boolean>> => {
    try {
      const result = await window.electron.ipcRenderer.invoke('database:deleteExample', id);

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }, []);

  const executeRawQuery = useCallback(async (sql: string, replacements?: any): Promise<DatabaseResult> => {
    try {
      const result = await window.electron.ipcRenderer.invoke('database:executeRawQuery', sql, replacements);

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }, []);

  return {
    createExample,
    findAllExamples,
    findExampleById,
    updateExample,
    deleteExample,
    executeRawQuery,
  };
} 