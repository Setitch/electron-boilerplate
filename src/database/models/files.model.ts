import { Column, DataType, Default, Index, Model, Table, Unique } from 'sequelize-typescript';

export const FileStorageTypes = ['local'] as const;
export type FileStorageType = typeof FileStorageTypes[number];

// add whatever type you want there
export const ObjectTypes = ['system'] as const;
export type ObjectType = typeof ObjectTypes[number];


export const SubTypes = ['image', 'font'] as const;
export type SubType = typeof SubTypes[number];

export interface FileEntityCreationAttributes {
  name: string;
  url?: string;
  hash?: string;
  storageType: FileStorageType;
  storageSettings: object;
  mimeType: string;
  size: number;
  typeSimplified: string;
  objectType: ObjectType;
  objectId?: null | number;
  subType?: SubType;
  subId?: null | number;
  isPublished: boolean;
  generationMeta?: object;
  dimensions: {width: number; height: number};
}

export interface FileEntityAttributes extends FileEntityCreationAttributes {
  resizes: {size: string; suffix: string; done: boolean};
  updatedBy: number;
  url: string;
  updatedAt: Date;
  createdAt: Date;
}

@Table({
  tableName: 'files',
})
export class FileEntity extends Model<FileEntityAttributes, FileEntityCreationAttributes> {
  @Column(DataType.STRING(256))
  declare name: string;
  
  @Unique
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare url: string;
  
  @Column(DataType.CHAR(512))
  declare hash: string;
  
  @Column(DataType.STRING(20))
  declare storageType: FileStorageType;
  
  @Column(DataType.JSONB)
  declare storageSettings: object;
  
  @Column(DataType.STRING)
  declare mimeType: string;
  
  @Column(DataType.STRING)
  declare typeSimplified: string;
  
  @Column(DataType.INTEGER)
  declare size: number;
  
  @Column(DataType.BOOLEAN)
  declare isPublished: boolean;
  
  @Index('file-full-position')
  @Column(DataType.STRING(20))
  declare objectType: string;
  
  @Index('file-full-position')
  @Column(DataType.INTEGER)
  declare objectId?: number;
  
  @Index('file-full-position')
  @Column(DataType.STRING(20))
  declare subType: SubType;

  @Index('file-full-position')
  @Column(DataType.INTEGER)
  declare subId?: number;
  
  @Column(DataType.JSONB)
  declare dimensions: {width: number; height: number};

  @Column(DataType.JSONB)
  declare generationMeta?: object;
}
