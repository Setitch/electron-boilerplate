# Database Setup with Sequelize

This project uses Sequelize with TypeScript for database operations in Electron. The database is stored locally using SQLite.

## Dependencies

- `sequelize` - ORM for Node.js
- `sequelize-typescript` - TypeScript decorators for Sequelize
- `sqlite3` - SQLite driver for Node.js

## Project Structure

```
src/database/
├── database.config.ts      # Sequelize configuration
├── database.service.ts     # Database service with common operations
├── models/
│   └── example.model.ts    # Example model with TypeScript decorators
└── README.md              # This file
```

## Usage

### 1. Creating Models

Create new models in the `models/` directory using TypeScript decorators:

```typescript
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({
  tableName: 'your_table',
  timestamps: true,
})
export class YourModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;
}
```

### 2. Register Models

Add your new models to the Sequelize configuration in `database.config.ts`:

```typescript
import { YourModel } from './models/your-model.model';

// In the Sequelize configuration:
models: [Example, YourModel], // Add your models here
```

### 3. Using in Main Process

The database is automatically initialized when the app starts. You can use the `DatabaseService` for operations:

```typescript
import { DatabaseService } from './database/database.service';

// Create a record
const newRecord = await DatabaseService.YourModel.create({
  name: 'Example Name',
});

// Find all records
const allRecords = await DatabaseService.YourModel.findAll();

// Find by ID
const record = await DatabaseService.YourModel.findByPk(1);

// Update record
await record.update({ name: 'Updated Name' });

// Delete record
await record.destroy();
```

### 4. Using in Renderer Process

Use the `useDatabase` hook in React components:

```typescript
import { useDatabase } from '../hooks/use-database.hook';

function MyComponent() {
  const { createExample, findAllExamples } = useDatabase();

  const handleCreate = async () => {
    const result = await createExample({
      name: 'New Example',
      description: 'Description here',
    });
    
    if (result.success) {
      console.log('Created:', result.result);
    }
  };

  const loadData = async () => {
    const result = await findAllExamples();
    if (result.success) {
      console.log('All examples:', result.result);
    }
  };
}
```

### 5. IPC Handlers

The database operations are exposed through IPC handlers in `src/ipc/database.ipc.ts`. You can add new handlers for your models:

```typescript
// Add to database.ipc.ts
ipcMain.handle('database:createYourModel', async (_, data) => {
  try {
    const result = await DatabaseService.YourModel.create(data);
    return { success: true, result: result.toJSON() };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

## Database Location

The SQLite database file is stored in the user's application data directory:
- Windows: `%APPDATA%/reactronite/app.sqlite`
- macOS: `~/Library/Application Support/reactronite/app.sqlite`
- Linux: `~/.config/reactronite/app.sqlite`

## Features

- **TypeScript Support**: Full type safety with decorators
- **Automatic Migrations**: Tables are created/updated automatically
- **IPC Integration**: Safe communication between main and renderer processes
- **Error Handling**: Comprehensive error handling and logging
- **Connection Management**: Automatic connection lifecycle management

## Best Practices

1. **Use Transactions**: For operations that modify multiple records
2. **Validate Data**: Always validate input data before database operations
3. **Handle Errors**: Always check the `success` property in results
4. **Use TypeScript**: Leverage TypeScript for type safety
5. **Keep Models Simple**: Follow single responsibility principle

## Example Component

See `src/app/components/database-example.tsx` for a complete example of how to use the database in a React component. 