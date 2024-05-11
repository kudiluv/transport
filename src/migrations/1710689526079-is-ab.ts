import { MigrationInterface, QueryRunner } from "typeorm";

export class IsAb1710689526079 implements MigrationInterface {
    name = 'IsAb1710689526079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle_position" ADD "isAB" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "AB" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "BA" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "position" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "position" TYPE geometry`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "position" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "position" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "BA" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "AB" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" DROP COLUMN "isAB"`);
    }

}
