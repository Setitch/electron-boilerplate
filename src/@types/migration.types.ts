import { QueryInterface } from 'sequelize';

export interface MigrationBaseType { 
  up: (queryInterface: QueryInterface) => Promise<void>;
  down: (queryInterface: QueryInterface) => Promise<void>;
}
export type MigrationModuleType = { migration: MigrationBaseType; default: MigrationBaseType };

// FOR UMZUG and FROM UMZUG
export const migrationsLanguageSpecificHelp = {
  '.ts': "TypeScript files can be required by adding `ts-node` as a dependency and calling `require('ts-node/register')` at the program entrypoint before running migrations.",
  '.sql': 'Try writing a resolver which reads file content and executes it as a sql query.',
};
