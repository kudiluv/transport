import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { z } from 'zod';

function parseEnvConfig() {
    const { data, error } = z
        .object({
            DB_NAME: z.string(),
            DB_HOST: z.string(),
            DB_PORT: z.coerce.number(),
            DB_USER: z.string(),
            DB_PSWD: z.string(),
        })
        .safeParse(dotenv.config().parsed);

    if (error) {
        throw new Error(`Data base config validation error: ${error.message}`);
    }

    return data;
}

const { DB_NAME, DB_HOST, DB_PORT, DB_USER, DB_PSWD } = parseEnvConfig();

export const ormconfig: DataSourceOptions = {
    type: 'postgres',
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_NAME,
    username: DB_USER,
    password: DB_PSWD,
    entities: [__dirname + '/**/*.entity{.ts,.js}', __dirname + '/**/*.view{.ts,.js}'],
    useUTC: true,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    logging: false,
};

const dataSource = new DataSource(ormconfig);
export default dataSource;
