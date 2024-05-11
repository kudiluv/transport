import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexOnTimestamp1709791128219 implements MigrationInterface {
    name = 'AddIndexOnTimestamp1709791128219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle_position" DROP CONSTRAINT "FK_6844484bf80dbb6456af3a9fed7"`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" DROP COLUMN "previusId"`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "AB" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "BA" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "position" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "position" TYPE geometry`);
        await queryRunner.query(`CREATE INDEX "IDX_4a0365a3006ce0b25699489e75" ON "vehicle_position" ("historyTimestampId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_4a0365a3006ce0b25699489e75"`);
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "position" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "position" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "BA" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "AB" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ADD "previusId" integer`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ADD CONSTRAINT "FK_6844484bf80dbb6456af3a9fed7" FOREIGN KEY ("previusId") REFERENCES "vehicle_position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
