import { MigrationInterface, QueryRunner } from "typeorm";

export class DetailedRoute1711656784821 implements MigrationInterface {
    name = 'DetailedRoute1711656784821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "route" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "route" DROP COLUMN "hasRoutePath"`);
        await queryRunner.query(`ALTER TABLE "route" ADD "routeNum" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "route" ADD "ABName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "route" ADD "BAName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "route" ADD "ABStations" character varying array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "route" ADD "BAStations" character varying array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bus_station" ADD "name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bus_station" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "route" DROP COLUMN "BAStations"`);
        await queryRunner.query(`ALTER TABLE "route" DROP COLUMN "ABStations"`);
        await queryRunner.query(`ALTER TABLE "route" DROP COLUMN "BAName"`);
        await queryRunner.query(`ALTER TABLE "route" DROP COLUMN "ABName"`);
        await queryRunner.query(`ALTER TABLE "route" DROP COLUMN "routeNum"`);
        await queryRunner.query(`ALTER TABLE "route" ADD "hasRoutePath" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "route" ADD "name" character varying NOT NULL`);
    }

}
