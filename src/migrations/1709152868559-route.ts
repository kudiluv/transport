import { MigrationInterface, QueryRunner } from "typeorm";

export class Route1709152868559 implements MigrationInterface {
    name = 'Route1709152868559'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "route" DROP COLUMN "path"`);
        await queryRunner.query(`CREATE TYPE "public"."route_type_enum" AS ENUM('bus', 'trol', 'tram', 'suburbanbus')`);
        await queryRunner.query(`ALTER TABLE "route" ADD "type" "public"."route_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "route" ADD "AB" geometry`);
        await queryRunner.query(`ALTER TABLE "route" ADD "BA" geometry`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "position" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "position" TYPE geometry`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "position" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "position" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "route" DROP COLUMN "BA"`);
        await queryRunner.query(`ALTER TABLE "route" DROP COLUMN "AB"`);
        await queryRunner.query(`ALTER TABLE "route" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."route_type_enum"`);
        await queryRunner.query(`ALTER TABLE "route" ADD "path" geometry(GEOMETRY,0)`);
    }

}
