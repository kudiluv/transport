import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1735657872606 implements MigrationInterface {
    name = 'Update1735657872606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "route" DROP CONSTRAINT "FK_2d366f868d52a8a5332c564ca60"`);
        await queryRunner.query(`ALTER TABLE "route" DROP CONSTRAINT "FK_980219ca3c816fb7f430cec12df"`);
        await queryRunner.query(`ALTER TABLE "route" DROP CONSTRAINT "REL_2d366f868d52a8a5332c564ca6"`);
        await queryRunner.query(`ALTER TABLE "route" DROP COLUMN "abDirectionId"`);
        await queryRunner.query(`ALTER TABLE "route" DROP CONSTRAINT "REL_980219ca3c816fb7f430cec12d"`);
        await queryRunner.query(`ALTER TABLE "route" DROP COLUMN "baDirectionId"`);
        await queryRunner.query(`ALTER TABLE "route_direction" ADD "type" character varying(255) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "route_direction"."type" IS 'Type of direction'`);
        await queryRunner.query(`ALTER TABLE "route_direction" ADD "routeId" integer`);
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "coordinates" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "coordinates" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "route_direction" ALTER COLUMN "coordinates" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "route_direction" ADD CONSTRAINT "FK_c1ff3d580eb9c8f4745caa9b299" FOREIGN KEY ("routeId") REFERENCES "route"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "route_direction" DROP CONSTRAINT "FK_c1ff3d580eb9c8f4745caa9b299"`);
        await queryRunner.query(`ALTER TABLE "route_direction" ALTER COLUMN "coordinates" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "coordinates" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "coordinates" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "route_direction" DROP COLUMN "routeId"`);
        await queryRunner.query(`COMMENT ON COLUMN "route_direction"."type" IS 'Type of direction'`);
        await queryRunner.query(`ALTER TABLE "route_direction" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "route" ADD "baDirectionId" integer`);
        await queryRunner.query(`ALTER TABLE "route" ADD CONSTRAINT "REL_980219ca3c816fb7f430cec12d" UNIQUE ("baDirectionId")`);
        await queryRunner.query(`ALTER TABLE "route" ADD "abDirectionId" integer`);
        await queryRunner.query(`ALTER TABLE "route" ADD CONSTRAINT "REL_2d366f868d52a8a5332c564ca6" UNIQUE ("abDirectionId")`);
        await queryRunner.query(`ALTER TABLE "route" ADD CONSTRAINT "FK_980219ca3c816fb7f430cec12df" FOREIGN KEY ("baDirectionId") REFERENCES "route_direction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "route" ADD CONSTRAINT "FK_2d366f868d52a8a5332c564ca60" FOREIGN KEY ("abDirectionId") REFERENCES "route_direction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
