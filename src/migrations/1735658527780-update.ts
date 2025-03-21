import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1735658527780 implements MigrationInterface {
    name = 'Update1735658527780';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "route_direction_bus_stations_bus_station" ("routeDirectionId" integer NOT NULL, "busStationId" character varying NOT NULL, CONSTRAINT "PK_80a9f6aa39b108ae0f8a48cbdba" PRIMARY KEY ("routeDirectionId", "busStationId"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_b1954a0e68ee42ec29ed602d83" ON "route_direction_bus_stations_bus_station" ("routeDirectionId") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_78673cb1ee5689a3c567c7d64d" ON "route_direction_bus_stations_bus_station" ("busStationId") `,
        );
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "coordinates" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "route_direction" ALTER COLUMN "coordinates" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "coordinates" TYPE geometry`);
        await queryRunner.query(
            `ALTER TABLE "route_direction_bus_stations_bus_station" ADD CONSTRAINT "FK_b1954a0e68ee42ec29ed602d83e" FOREIGN KEY ("routeDirectionId") REFERENCES "route_direction"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE "route_direction_bus_stations_bus_station" ADD CONSTRAINT "FK_78673cb1ee5689a3c567c7d64d6" FOREIGN KEY ("busStationId") REFERENCES "bus_station"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "route_direction_bus_stations_bus_station" DROP CONSTRAINT "FK_78673cb1ee5689a3c567c7d64d6"`,
        );
        await queryRunner.query(
            `ALTER TABLE "route_direction_bus_stations_bus_station" DROP CONSTRAINT "FK_b1954a0e68ee42ec29ed602d83e"`,
        );
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "coordinates" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "route_direction" ALTER COLUMN "coordinates" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "coordinates" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`DROP INDEX "public"."IDX_78673cb1ee5689a3c567c7d64d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b1954a0e68ee42ec29ed602d83"`);
        await queryRunner.query(`DROP TABLE "route_direction_bus_stations_bus_station"`);
    }
}
