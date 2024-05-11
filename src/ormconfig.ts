import { DataSource, DataSourceOptions } from 'typeorm';

export const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  entities: [
    __dirname + '/**/*.entity{.ts,.js}',
    __dirname + '/**/*.view{.ts,.js}',
  ],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  logging: false,
};

const dataSource = new DataSource(ormconfig);
export default dataSource;
