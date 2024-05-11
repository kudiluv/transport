import { MigrationInterface, QueryRunner } from "typeorm";

export class PreviusPosition1707601254935 implements MigrationInterface {
    name = 'PreviusPosition1707601254935'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle_position" ADD "previusId" integer`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "path" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "position" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "position" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ADD CONSTRAINT "FK_6844484bf80dbb6456af3a9fed7" FOREIGN KEY ("previusId") REFERENCES "vehicle_position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle_position" DROP CONSTRAINT "FK_6844484bf80dbb6456af3a9fed7"`);
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "position" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "position" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "path" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" DROP COLUMN "previusId"`);
    }

}
