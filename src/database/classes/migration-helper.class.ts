import { DataTypes, QueryInterface, Transaction } from 'sequelize';
import { abstractSequelizeMigrationUndeletedColumns, MigrationColumnDefinitions } from '../bases/migration.base';
import Debug from 'debug';

type HashString = string;

export class MigrationHelperClass {
  protected logger = Debug(MigrationHelperClass.name);

  private static instances: Record<HashString, MigrationHelperClass> = {};

  protected tables: string[] = [];

  protected columns: Record<string, any> = {};

  protected readonly id = Math.random();
  
  static async from(queryInterface: QueryInterface) {
    const key = JSON.stringify(queryInterface.sequelize.config);
    if (!Object.hasOwn(MigrationHelperClass.instances, key)) {
      MigrationHelperClass.instances[key] = new MigrationHelperClass(queryInterface);
      MigrationHelperClass.instances[key].logger = Debug(`${MigrationHelperClass}:${MigrationHelperClass.instances[key].id}`);
    }
    
    await MigrationHelperClass.instances[key].refresh();
    
    return MigrationHelperClass.instances[key];
  }
  
  protected constructor(protected readonly queryInterface: QueryInterface) {
    
  }
  
  async refresh(transaction?: Transaction) {
    this.tables = await this.queryInterface.showAllTables({ transaction });
    this.columns = {};
  }
  
  async prepare(tableOrTables: string | string[]) {
    tableOrTables = Array.isArray(tableOrTables) ? tableOrTables : [tableOrTables];
    for (const name of tableOrTables) {
      if (!this.tableExists(name)) continue;
      this.columns[name] = await this.queryInterface.describeTable(name);
    }
  }
  
  getUpdateQueryFromObject(obj: object, flag = false): string {
    const fields = Object.keys(obj).sort();
    
    return fields.map(x => `${x} = ${flag ? `:${x}` : '?'}`).join(',');
  }

  getUpdateQueryValuesFromObject<T = boolean>(obj: object, flag = false) {
    const fields = Object.keys(obj).sort();
    
    // if (flag) {
    //   return Object.fromEntries(fields.map(f => [`:${f}`, (obj as any)[f]]));
    // } else {
      return fields.map(f => (obj as any)[f] as any) as any[];
    // }
  }
  
  getInsertQueryColumns(obj: object) {
    const fields = Object.keys(obj).sort();
    
    return fields.map(f => this.queryInterface.quoteIdentifier(f)).join(',');
  }
  
  getInsertQueryValuesPlaceholder(obj: object) {
    const fields = Object.keys(obj).sort();
  
    return fields.map(f => '?').join(',');
  }
  
  tableExists(table: string): boolean {
    // console.log(this.tables, this.tables.indexOf(table), this.tables.indexOf(table) !== -1);
    return this.tables.includes(table);
  }
  
  columnExists(table: string, column: string) {
    return this.columns[table] ? Object.hasOwn(this.columns[table], column) : false;
  }
  
  columnData(table: string, column: string) {
    console.log(this.columns[table][column]);
  }
  
  async addMissingColumns(table: string, columnData: MigrationColumnDefinitions, transaction?: Transaction) {
    for (const col in columnData) {
      if (!this.columnExists(table, 'deletedAt')) {
        console.debug(`[Column Added]: ${ table }.${col}`);
        await this.queryInterface.addColumn(table, col, columnData[col], { transaction });
      } else {
        console.debug(`[Column Skipped]: ${ table }.${col}`);
      }
    }
  }
  
  columnType(table: string, column: string) {
    const type = this.columns[table]?.[column]?.type || '';
    if (type.startsWith('VARCHAR') || type.startsWith('CHARACTER VARYING')) {
      return DataTypes.STRING;
    }
    
    // TODO: More types there
  }
  
  columnLength(table: string, column: string) {
    const type: string = this.columns[table]?.[column]?.type || '';
    console.log('type', type);
    const left = type.split('(')[1] || '0';
    console.log('left', left);
    const right = left.split(')')[0] || '0';
    console.log('right', right);
    
    return Number.parseInt(right) || 0;
  }
}
