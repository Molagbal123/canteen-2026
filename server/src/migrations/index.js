import { DataTypes, QueryTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from '../config/database.js';

const normalizeTableNames = (tables) =>
  new Set(tables.map((table) => (typeof table === 'string' ? table : Object.values(table)[0])));

const createInitialSchema = async ({ queryInterface, transaction }) => {
  const tables = normalizeTableNames(await queryInterface.showAllTables({ transaction }));

  if (!tables.has('users')) {
    await queryInterface.createTable('users', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(255), allowNull: false },
      role: { type: DataTypes.ENUM('user', 'admin'), allowNull: false, defaultValue: 'user' },
      phone: { type: DataTypes.STRING(20), allowNull: true, defaultValue: '' },
      address: { type: DataTypes.STRING(255), allowNull: true, defaultValue: '' },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    }, { transaction });
  }

  if (!tables.has('foods')) {
    await queryInterface.createTable('foods', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      image: { type: DataTypes.STRING(500), allowNull: true, defaultValue: '' },
      image_public_id: { type: DataTypes.STRING(255), allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true, defaultValue: '' },
      category: { type: DataTypes.STRING(50), allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
    }, { transaction });
  }

  if (!tables.has('orders')) {
    await queryInterface.createTable('orders', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'RESTRICT',
      },
      request_id: { type: DataTypes.STRING(64), allowNull: true, unique: true },
      total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      status: {
        type: DataTypes.ENUM('pending', 'cooking', 'delivering', 'done'),
        allowNull: false,
        defaultValue: 'pending',
      },
      customer_name: { type: DataTypes.STRING(100), allowNull: false },
      customer_phone: { type: DataTypes.STRING(20), allowNull: false },
      customer_address: { type: DataTypes.STRING(255), allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    }, { transaction });
  }

  if (!tables.has('order_items')) {
    await queryInterface.createTable('order_items', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'orders', key: 'id' },
        onDelete: 'CASCADE',
      },
      food_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'foods', key: 'id' },
        onDelete: 'RESTRICT',
      },
      food_name: { type: DataTypes.STRING(100), allowNull: true },
      food_image: { type: DataTypes.STRING(500), allowNull: true },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    }, { transaction });
  }
};

const addColumnIfMissing = async (queryInterface, table, definition, transaction) => {
  const columns = await queryInterface.describeTable(table, { transaction });
  if (!columns[definition.name]) {
    await queryInterface.addColumn(table, definition.name, definition.options, { transaction });
  }
};

const addOrderHistoryFields = async ({ queryInterface, transaction }) => {
  await addColumnIfMissing(queryInterface, 'orders', {
    name: 'request_id',
    options: { type: DataTypes.STRING(64), allowNull: true },
  }, transaction);
  await addColumnIfMissing(queryInterface, 'order_items', {
    name: 'food_name',
    options: { type: DataTypes.STRING(100), allowNull: true },
  }, transaction);
  await addColumnIfMissing(queryInterface, 'order_items', {
    name: 'food_image',
    options: { type: DataTypes.STRING(500), allowNull: true },
  }, transaction);
  await addColumnIfMissing(queryInterface, 'foods', {
    name: 'image_public_id',
    options: { type: DataTypes.STRING(255), allowNull: true },
  }, transaction);
  await addColumnIfMissing(queryInterface, 'foods', {
    name: 'deleted_at',
    options: { type: DataTypes.DATE, allowNull: true },
  }, transaction);

  const indexes = await queryInterface.showIndex('orders', { transaction });
  if (!indexes.some((index) => index.name === 'orders_request_id_unique')) {
    await queryInterface.addIndex('orders', ['request_id'], {
      name: 'orders_request_id_unique',
      unique: true,
      transaction,
    });
  }

  await sequelize.query(
    `UPDATE order_items AS oi
     INNER JOIN foods AS f ON f.id = oi.food_id
     SET oi.food_name = COALESCE(oi.food_name, f.name),
         oi.food_image = COALESCE(oi.food_image, f.image)
     WHERE oi.food_name IS NULL OR oi.food_image IS NULL`,
    { transaction }
  );
};

const migrations = [
  { name: '001_initial_schema', up: createInitialSchema },
  { name: '002_order_history_and_soft_delete', up: addOrderHistoryFields },
];

export const runMigrations = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const tables = normalizeTableNames(await queryInterface.showAllTables());

  if (!tables.has('schema_migrations')) {
    await queryInterface.createTable('schema_migrations', {
      name: { type: DataTypes.STRING(150), primaryKey: true },
      applied_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
  }

  const appliedRows = await sequelize.query('SELECT name FROM schema_migrations', {
    type: QueryTypes.SELECT,
  });
  const applied = new Set(appliedRows.map((row) => row.name));

  for (const migration of migrations) {
    if (applied.has(migration.name)) continue;

    await sequelize.transaction(async (transaction) => {
      await migration.up({ queryInterface, transaction });
      await queryInterface.bulkInsert(
        'schema_migrations',
        [{ name: migration.name, applied_at: new Date() }],
        { transaction }
      );
    });
    console.log(`Migration applied: ${migration.name}`);
  }
};

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  runMigrations()
    .then(() => sequelize.close())
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exitCode = 1;
    });
}
