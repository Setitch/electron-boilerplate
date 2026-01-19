import { Sequelize } from 'sequelize-typescript';
import { app } from 'electron';
import path from 'node:path';
import sqlite3 from 'sqlite3';
import { MigrationError, SequelizeStorage, Umzug } from 'umzug';
import { join } from 'node:path';
import { MigrationModuleType, migrationsLanguageSpecificHelp } from '../@types/migration.types';

import { FileEntity } from './models/files.model';
import Debug from 'debug';

const debug = Debug('umzug');
const Logger = {
  info: debug.log,
  log: debug.log,
  warn: debug.log,
  error: debug.log,
  debug: debug.log,
};

const UmZugLogger: typeof Logger & {
  info(message: any, context?: string): void;
  info(message: any, ...optionalParams: [...any, string?]): void;
} = Logger;
(UmZugLogger as any).info = UmZugLogger.log;


export class DatabaseConfig {
  private static instance: Sequelize | null = null;

  private static dbPath: string;

  static {
    // Store database in user data directory
    const userDataPath = app.getPath('userData');
    this.dbPath = path.join(userDataPath, 'app.sqlite');
  }

  /**
   * Get Sequelize instance (singleton)
   */
  static getInstance(): Sequelize {
    if (!this.instance) {
      this.instance = new Sequelize({
        dialect: 'sqlite',
        storage: this.dbPath,
        logging: false, // Set to console.log for debugging
        models: [FileEntity], // Add your models here
        dialectModule: sqlite3,
      });
    }

    return this.instance;
  }

  /**
   * Initialize database connection and sync models
   */
  static async initialize(): Promise<void> {
    try {
      const sequelize = this.getInstance();
      
      // Test the connection
      await sequelize.authenticate();
      console.log('Database connection established successfully.', this.dbPath);
      
      // Sync all models with database
      await sequelize.sync({ force: false }); // Force recreate tables to ensure model changes are applied
      // await sequelize.sync({ alter: true });
      // await sequelize.sync();
      console.log('Database models synchronized.');
      

      await this.migrate();
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw error;
    }
  }

  static async migrate(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') {
      const umzug = new Umzug({
        storage: new SequelizeStorage({ sequelize: this.getInstance() }),
        context: this.getInstance().getQueryInterface(),
        migrations: {
          glob: ['*.{t,j}s', { cwd: join(__dirname, 'migrations'), ignore: ['*.d.ts'] }],
          resolve: (res) => {
            if (!res.path) {
              throw new Error(`Can't use default resolver for non-filesystem migrations`);
            }
            const properPath = join(__dirname, 'migrations', res.name);
            
            const module: MigrationModuleType = (() => {
              try {
                 
                return require(properPath);
              } catch (error) {
                if (error instanceof SyntaxError && res.path.endsWith('.ts')) {
                  error.message += '\n\n' + migrationsLanguageSpecificHelp['.ts'];
                }
                throw error;
                
              }
            })();
            
            return {
              // adjust the parameters Umzug will
              // pass to migration methods when called
              name: res.name,
              path: properPath,
              up: async () => module.migration.up(res.context),
              down: async () => module.migration.down(res.context),
            };
          },
        },
        logger: UmZugLogger,
      });
      umzug.debug.enabled = false;
      umzug.on('migrating', ev => console.log({ name: ev.name, path: ev.path }));
      
      try {
        const up = await umzug.up();
        console.log('Migrations completed successfully');
      } catch (error) {
        console.error('Migration failed:', error);
        // Don't throw - let the app continue with sync
      }
    }
  }

  /**
   * Close database connection
   */
  static async close(): Promise<void> {
    if (this.instance) {
      await this.instance.close();
      this.instance = null;
      console.log('Database connection closed.');
    }
  }

  /**
   * Get database path
   */
  static getDbPath(): string {
    return this.dbPath;
  }
} 
