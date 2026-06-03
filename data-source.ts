import { DataSource, DataSourceOptions } from 'typeorm';

const dbConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '',
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*{.js,.ts}'],
  database: 'my_carv',
  entities: [__dirname + '/**/*.entity{.js,.ts}'],
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      database: 'my_carv',
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      database: 'my_carv_test',
      dropSchema: true,
      synchronize: true,
      migrationsRun: true,
    });
    break;
  case 'production':
    Object.assign(dbConfig, {
      url: process.env.DATABASE_URL,
      migrationsRun: true,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    break;
  default:
    throw new Error('unknown environment!');
}

export const AppDataSource = new DataSource(dbConfig);
export const dataSourceOptions = dbConfig;
