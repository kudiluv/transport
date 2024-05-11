import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedNewRouteType1714916261448 implements MigrationInterface {
    name = 'AddedNewRouteType1714916261448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."route_type_enum" RENAME TO "route_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."route_type_enum" AS ENUM('bus', 'trol', 'tram', 'suburbanbus', 'train')`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "type" TYPE "public"."route_type_enum" USING "type"::"text"::"public"."route_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."route_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."route_type_enum_old" AS ENUM('bus', 'trol', 'tram', 'suburbanbus')`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "type" TYPE "public"."route_type_enum_old" USING "type"::"text"::"public"."route_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."route_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."route_type_enum_old" RENAME TO "route_type_enum"`);
    }

}
