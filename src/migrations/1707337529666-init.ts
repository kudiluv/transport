import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1707337529666 implements MigrationInterface {
    name = 'Init1707337529666'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "history_timestamp" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1500f0faaa576f8c74fbf1ee941" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "route" ("id" SERIAL NOT NULL, "path" geometry, "name" character varying NOT NULL, CONSTRAINT "PK_08affcd076e46415e5821acf52d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicle" ("id" SERIAL NOT NULL, "vehicleId" character varying NOT NULL, "routeId" integer, CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicle_position" ("id" SERIAL NOT NULL, "position" geometry NOT NULL, "speed" integer NOT NULL, "vehicleId" integer, "historyTimestampId" integer, CONSTRAINT "PK_03bae0c83b5ed880f29af14484e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bus_station" ("id" character varying NOT NULL, "position" geometry NOT NULL, CONSTRAINT "PK_49ec7776dcaa2fbee136e5adf1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_245d3e8ef80807bcdc26bb537e9" FOREIGN KEY ("routeId") REFERENCES "route"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ADD CONSTRAINT "FK_a527c01c70ddfa21c175d14d6f6" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ADD CONSTRAINT "FK_4a0365a3006ce0b25699489e75d" FOREIGN KEY ("historyTimestampId") REFERENCES "history_timestamp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`INSERT INTO public.history_timestamp(id, date) VALUES (default, default)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle_position" DROP CONSTRAINT "FK_4a0365a3006ce0b25699489e75d"`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" DROP CONSTRAINT "FK_a527c01c70ddfa21c175d14d6f6"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_245d3e8ef80807bcdc26bb537e9"`);
        await queryRunner.query(`DROP TABLE "bus_station"`);
        await queryRunner.query(`DROP TABLE "vehicle_position"`);
        await queryRunner.query(`DROP TABLE "vehicle"`);
        await queryRunner.query(`DROP TABLE "route"`);
        await queryRunner.query(`DROP TABLE "history_timestamp"`);
    }

}
