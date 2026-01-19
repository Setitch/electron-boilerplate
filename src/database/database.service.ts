import { DatabaseConfig } from './database.config';
import { Example } from './models/example.model';
import { FileEntity, FileEntityCreationAttributes, FileEntityAttributes, SubType, ObjectType } from './models/files.model';
import { Op, WhereOptions } from 'sequelize';

const INDEX_FRACTURING_DELTA = 0.000_000_1;

export const DatabaseService = {
  /**
   * Initialize the database
   */
  async initialize(): Promise<void> {
    await DatabaseConfig.initialize();
  },

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    await DatabaseConfig.close();
  },

  /**
   * Get Sequelize instance
   */
  getSequelize() {
    return DatabaseConfig.getInstance();
  },

  /**
   * Example model operations
   */
  get Example() {
    return Example;
  },


  /**
   * Create a new example record
   */
  async createExample(data: { name: string; description?: string; isActive?: boolean }) {
    return await Example.create(data);
  },

  /**
   * Find all examples
   */
  async findAllExamples() {
    return await Example.findAll();
  },

  /**
   * Find example by ID
   */
  async findExampleById(id: number) {
    return await Example.findByPk(id);
  },

  /**
   * Update example
   */
  async updateExample(id: number, data: Partial<{ name: string; description: string; isActive: boolean }>) {
    const example = await Example.findByPk(id);
    if (example) {
      return await example.update(data);
    }

    return null;
  },

  /**
   * Delete example
   */
  async deleteExample(id: number) {
    const example = await Example.findByPk(id);
    if (example) {
      await example.destroy();

      return true;
    }

    return false;
  },

  /**
   * Execute raw SQL query
   */
  async executeRawQuery(sql: string, replacements?: any) {
    const sequelize = DatabaseConfig.getInstance();

    return await sequelize.query(sql, { replacements });
  },

  /**
   * File operations
   */
  async createFile(data: FileEntityCreationAttributes) {
    return await FileEntity.create(data);
  },

  async findFileById(id: number) {
    return await FileEntity.findByPk(id);
  },
  async findFileByUrl(url: string) {
    return await FileEntity.findOne({ where: { url } });
  },

  async findFilesByType(objectType: string, subType?: string) {
    const where: WhereOptions<FileEntityAttributes> = { objectType };
    if (subType) {
      where.subType = subType;
    }
    
    return await FileEntity.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
  },

  async findImageFiles(searchOptions: Partial<FileEntityAttributes> & {query?: string}) {
    return await FileEntity.findAll({
      where: {
        typeSimplified: 'image',
        isPublished: true,
      },
      order: [['createdAt', 'DESC']],
    });
  },

  async searchFiles(query: string) {
    const searchTerm = `%${query}%`;
    
    return await FileEntity.findAll({
      where: {
        typeSimplified: 'image',
        isPublished: true,
        [Op.or]: [
          { name: { [Op.iLike]: searchTerm } },
          DatabaseConfig.getInstance().literal(`
            (generation_meta IS NOT NULL AND (
              generation_meta->>'name' ILIKE :searchTerm OR
              generation_meta->>'id' ILIKE :searchTerm
            ))
          `),
        ],
      },
      replacements: { searchTerm },
      order: [['createdAt', 'DESC']],
    });
  },

  async updateFile(id: number, data: Partial<FileEntityAttributes>) {
    const file = await FileEntity.findByPk(id);
    if (file) {
      return await file.update(data);
    }

    return null;
  },

  async deleteFile(id: number) {
    const file = await FileEntity.findByPk(id);
    if (file) {
      await file.destroy();

      return true;
    }

    return false;
  },

  async getFileUrl(id: number): Promise<string | null> {
    const file = await FileEntity.findByPk(id);

    return file ? file.url : null;
  },

  async unpublishFile(objectType: ObjectType, objectId: number, subType: SubType, subId?: number) {
    const where: WhereOptions<FileEntityAttributes> = {};
    if (objectType) where.objectType = objectType;
    if (objectId) where.objectId = objectId;
    if (subType) where.subType = subType;
    if (subId) where.subId = subId;

    return await FileEntity.update({ isPublished: false }, { where });
  },
};
