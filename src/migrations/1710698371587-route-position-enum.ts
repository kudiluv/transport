import { MigrationInterface, QueryRunner } from "typeorm";

export class RoutePositionEnum1710698371587 implements MigrationInterface {
    name = 'RoutePositionEnum1710698371587'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle_position" RENAME COLUMN "isAB" TO "route_position"`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "AB" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "BA" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "position" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" DROP COLUMN "route_position"`);
        await queryRunner.query(`CREATE TYPE "public"."vehicle_position_route_position_enum" AS ENUM('IDLE', 'AB', 'BA')`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ADD "route_position" "public"."vehicle_position_route_position_enum" NOT NULL DEFAULT 'IDLE'`);
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "position" TYPE geometry`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "position" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" DROP COLUMN "route_position"`);
        await queryRunner.query(`DROP TYPE "public"."vehicle_position_route_position_enum"`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ADD "route_position" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "position" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "BA" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "AB" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" RENAME COLUMN "route_position" TO "isAB"`);
    }

}
