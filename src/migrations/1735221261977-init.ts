import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1735221261977 implements MigrationInterface {
    name = 'Init1735221261977';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "route" ("id" SERIAL NOT NULL, "num" character varying NOT NULL, "type" character varying(255) NOT NULL, "abDirectionId" integer, "baDirectionId" integer, CONSTRAINT "REL_2d366f868d52a8a5332c564ca6" UNIQUE ("abDirectionId"), CONSTRAINT "REL_980219ca3c816fb7f430cec12d" UNIQUE ("baDirectionId"), CONSTRAINT "PK_08affcd076e46415e5821acf52d" PRIMARY KEY ("id")); COMMENT ON COLUMN "route"."num" IS 'Number of route'; COMMENT ON COLUMN "route"."type" IS 'Type of route'`,
        );
        await queryRunner.query(`CREATE INDEX "IDX_7ee3fd25b6688c2ca69efc729f" ON "route" ("num") `);
        await queryRunner.query(`CREATE INDEX "IDX_8ecf115f18e0781a2aa6e0a438" ON "route" ("type") `);
        await queryRunner.query(
            `CREATE TABLE "bus_station" ("id" character varying NOT NULL, "coordinates" geometry NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_49ec7776dcaa2fbee136e5adf1d" PRIMARY KEY ("id")); COMMENT ON COLUMN "bus_station"."coordinates" IS 'Coordinates of bus station'; COMMENT ON COLUMN "bus_station"."name" IS 'Name of bus station'`,
        );
        await queryRunner.query(
            `CREATE TABLE "route_direction" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "coordinates" geometry NOT NULL, CONSTRAINT "PK_2e8dedbf06864d7d138b1467102" PRIMARY KEY ("id")); COMMENT ON COLUMN "route_direction"."name" IS 'Name of direction'; COMMENT ON COLUMN "route_direction"."coordinates" IS 'Coordinates of direction'`,
        );
        await queryRunner.query(
            `CREATE TABLE "history_timestamp" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1500f0faaa576f8c74fbf1ee941" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`CREATE INDEX "IDX_6e10d82655437952f1c92ee553" ON "history_timestamp" ("date") `);
        await queryRunner.query(
            `CREATE TABLE "vehicle" ("id" SERIAL NOT NULL, "regNumber" character varying(255) NOT NULL, CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id")); COMMENT ON COLUMN "vehicle"."regNumber" IS 'Registration number'`,
        );
        await queryRunner.query(
            `CREATE TABLE "vehicle_position" ("id" SERIAL NOT NULL, "coordinates" geometry NOT NULL, "speed" integer NOT NULL, "rotation" integer NOT NULL, "routeDirectionId" integer, "vehicleId" integer, "historyTimestampId" integer, CONSTRAINT "PK_03bae0c83b5ed880f29af14484e" PRIMARY KEY ("id")); COMMENT ON COLUMN "vehicle_position"."coordinates" IS 'Coordinates of vehicle'; COMMENT ON COLUMN "vehicle_position"."speed" IS 'Speed of vehicle'; COMMENT ON COLUMN "vehicle_position"."rotation" IS 'Rotation of vehicle'`,
        );
        await queryRunner.query(
            `ALTER TABLE "route" ADD CONSTRAINT "FK_2d366f868d52a8a5332c564ca60" FOREIGN KEY ("abDirectionId") REFERENCES "route_direction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "route" ADD CONSTRAINT "FK_980219ca3c816fb7f430cec12df" FOREIGN KEY ("baDirectionId") REFERENCES "route_direction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "vehicle_position" ADD CONSTRAINT "FK_4c05af025b4cfcbf4512c27af20" FOREIGN KEY ("routeDirectionId") REFERENCES "route_direction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "vehicle_position" ADD CONSTRAINT "FK_a527c01c70ddfa21c175d14d6f6" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "vehicle_position" ADD CONSTRAINT "FK_4a0365a3006ce0b25699489e75d" FOREIGN KEY ("historyTimestampId") REFERENCES "history_timestamp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle_position" DROP CONSTRAINT "FK_4a0365a3006ce0b25699489e75d"`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" DROP CONSTRAINT "FK_a527c01c70ddfa21c175d14d6f6"`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" DROP CONSTRAINT "FK_4c05af025b4cfcbf4512c27af20"`);
        await queryRunner.query(`ALTER TABLE "route" DROP CONSTRAINT "FK_980219ca3c816fb7f430cec12df"`);
        await queryRunner.query(`ALTER TABLE "route" DROP CONSTRAINT "FK_2d366f868d52a8a5332c564ca60"`);
        await queryRunner.query(`DROP TABLE "vehicle_position"`);
        await queryRunner.query(`DROP TABLE "vehicle"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6e10d82655437952f1c92ee553"`);
        await queryRunner.query(`DROP TABLE "history_timestamp"`);
        await queryRunner.query(`DROP TABLE "route_direction"`);
        await queryRunner.query(`DROP TABLE "bus_station"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8ecf115f18e0781a2aa6e0a438"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7ee3fd25b6688c2ca69efc729f"`);
        await queryRunner.query(`DROP TABLE "route"`);
    }
}
