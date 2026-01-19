import { app } from 'electron';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { FileEntity, FileEntityAttributes } from '@/database/models/files.model';
import { DatabaseService } from '@/database/database.service';

export class FileStorageService {
  private static userDataPath = app.getPath('userData');

  private static uploadsPath = path.join(this.userDataPath, 'uploads');

  private static imagesPath = path.join(this.uploadsPath, 'images');

  /**
   * Initialize storage directories
   */
  static async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.uploadsPath, { recursive: true });
      await fs.mkdir(this.imagesPath, { recursive: true });
    } catch (error) {
      console.error('Failed to initialize storage directories:', error);
      throw error;
    }
  }

  /**
   * Save file to storage
   */
  static async saveFile(buffer: Buffer, originalFilename: string): Promise<{ url: string; hash: string; size: number; relativePath: string }> {
    // Generate hash for duplicate detection
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    
    // Create date-based directory structure
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    
    const dateDir = path.join(this.imagesPath, year, month, day);
    await fs.mkdir(dateDir, { recursive: true });
    
    // Generate unique filename
    const ext = path.extname(originalFilename);
    const filename = `${hash}_${Date.now()}${ext}`;
    const filePath = path.join(dateDir, filename);
    
    // Save file
    await fs.writeFile(filePath, buffer);

    console.log(this.uploadsPath, filePath);
    
    // Generate URL (relative to uploads directory)
    const relativePath = path.relative(this.uploadsPath, filePath);
    const url = `file:///${relativePath.replaceAll('\\', '/')}`;
    
    return {
      url,
      hash,
      size: buffer.length,
      relativePath,
    };
  }

  /**
   * Get absolute file path from URL
   */
  static async getAbsolutePath(urlOrId: string | number): Promise<string | null> {
    try {
    let file: FileEntity | null = null;
    file = await (typeof urlOrId === 'number' ? DatabaseService.findFileById(urlOrId) : DatabaseService.findFileByUrl(urlOrId));

    if (!file) return null;

    // Remove 'file:///' prefix and convert to absolute path
    const relativePath = file.url.replace(/^file:\/\/\//, '');

    return path.join(this.uploadsPath, relativePath);
    } catch (error) {
      console.error('Get absolute path error:', error);

      return null;
    }
  }

  /**
   * Check if file exists
   */
  static async fileExists(url: string): Promise<boolean> {
    try {
      const absolutePath = await this.getAbsolutePath(url);
      if (!absolutePath) return true;

      await fs.access(absolutePath);

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Delete file from storage
   */
  static async deleteFile(url: string): Promise<boolean> {
    try {
      const absolutePath = await this.getAbsolutePath(url);
      if (!absolutePath) return true;

      await fs.unlink(absolutePath);

      return true;
    } catch (error) {
      console.error('Failed to delete file:', error);

      return false;
    }
  }

  /**
   * Get file info
   */
  static async getFileInfo(url: string): Promise<{ exists: boolean; size?: number; mtime?: Date }> {
    try {
      const absolutePath = await this.getAbsolutePath(url);
      if (!absolutePath) return { exists: false };

      const stats = await fs.stat(absolutePath);

      return {
        exists: true,
        size: stats.size,
        mtime: stats.mtime,
      };
    } catch {
      return { exists: false };
    }
  }

  /**
   * Get file buffer
   */
  static async getFileBuffer(url: string): Promise<Buffer|null> {
    const absolutePath = await this.getAbsolutePath(url);
    if (!absolutePath) return null;

    return await fs.readFile(absolutePath);
  }
} 