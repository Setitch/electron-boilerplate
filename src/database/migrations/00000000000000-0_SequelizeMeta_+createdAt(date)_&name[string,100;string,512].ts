import { QueryInterface, DataTypes, QueryTypes } from 'sequelize';
import { MigrationHelperClass } from '../classes/migration-helper.class';
import { MigrationBaseType } from '../../@types/migration.types';

const TABLE_NAME = 'SequelizeMeta';

export const migration: MigrationBaseType = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const helper = await MigrationHelperClass.from(queryInterface);
    await helper.prepare(TABLE_NAME);
  
    return queryInterface.sequelize.transaction(async (transaction) => {
      // here go all migration changes
      if (!helper.tableExists(TABLE_NAME)) {
        await queryInterface.createTable(TABLE_NAME, {
          name: {
            primaryKey: true,
            type: DataTypes.STRING(512),
          },
          createdAt: {
            type: DataTypes.DATE,
            defaultValue: queryInterface.sequelize.literal('CURRENT_TIMESTAMP'),
          },
        });
      } else {
        if (!helper.columnExists(TABLE_NAME, 'createdAt')) {
          await queryInterface.addColumn(TABLE_NAME, 'createdAt', {
            type: DataTypes.DATE,
            defaultValue: queryInterface.sequelize.literal('CURRENT_TIMESTAMP'),
          });
        }
        if (!helper.columnExists(TABLE_NAME, 'name')) {
          await queryInterface.addColumn(TABLE_NAME, 'name', {
            primaryKey: true,
            type: DataTypes.STRING(512),
          });
        } else {
          // helper.columnData(TABLE_NAME, 'name');
          if (helper.columnType(TABLE_NAME, 'name') === DataTypes.STRING) {
            if (helper.columnLength(TABLE_NAME, 'name') < 512) {
              await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS "${ TABLE_NAME }" ALTER COLUMN "name" SET DATA TYPE VARCHAR(512)`);
            }
          }
        }
      }
    });
  },
  
  down: (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.sequelize.transaction(
      async (transaction) => {
        // here go all migration undo changes
      },
    );
  },
};

export default migration;
