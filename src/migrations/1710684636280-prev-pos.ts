import { MigrationInterface, QueryRunner } from "typeorm";

export class PrevPos1710684636280 implements MigrationInterface {
    name = 'PrevPos1710684636280'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle_position" ADD "prevPositionId" integer`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "AB" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "BA" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "position" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "position" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ADD CONSTRAINT "FK_8310c3b3339eeb9c7587b5f7b13" FOREIGN KEY ("prevPositionId") REFERENCES "vehicle_position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle_position" DROP CONSTRAINT "FK_8310c3b3339eeb9c7587b5f7b13"`);
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "position" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "position" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "BA" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "AB" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" DROP COLUMN "prevPositionId"`);
    }

}
