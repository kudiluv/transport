import { MigrationInterface, QueryRunner } from "typeorm";

export class SpatialIndex1710875883927 implements MigrationInterface {
    name = 'SpatialIndex1710875883927'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "AB" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "BA" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "position" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "position" TYPE geometry`);
        await queryRunner.query(`CREATE INDEX "IDX_5a7bda4fc0593b19e1113668a0" ON "vehicle_position" USING GiST ("position") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_5a7bda4fc0593b19e1113668a0"`);
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "position" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "position" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "BA" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "AB" TYPE geometry(GEOMETRY,0)`);
    }

}
