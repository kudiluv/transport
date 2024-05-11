import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveSpatialIndex1710967078711 implements MigrationInterface {
    name = 'RemoveSpatialIndex1710967078711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_4a0365a3006ce0b25699489e75"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5a7bda4fc0593b19e1113668a0"`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "AB" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "BA" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "position" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "position" TYPE geometry`);
        await queryRunner.query(`CREATE INDEX "history_timestamp_id" ON "vehicle_position" ("historyTimestampId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."history_timestamp_id"`);
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "position" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "position" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "BA" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "AB" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`CREATE INDEX "IDX_5a7bda4fc0593b19e1113668a0" ON "vehicle_position" USING GiST ("position") `);
        await queryRunner.query(`CREATE INDEX "IDX_4a0365a3006ce0b25699489e75" ON "vehicle_position" ("historyTimestampId") `);
    }

}
