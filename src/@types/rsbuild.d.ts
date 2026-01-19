// Rsbuild plugin runtime keys interface
export interface RsbuildPluginRuntimeKeys {
  RSBUILD_DEV_SERVER_URL: string;
  RSBUILD_NAME: string;
}

// Extend NodeJS.Process interface for Rsbuild dev servers
declare global {
  namespace NodeJS {
    interface Process {
      rsbuildDevServers?: Record<string, any>;
    }
  }
} 