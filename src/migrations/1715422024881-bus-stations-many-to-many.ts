import { MigrationInterface, QueryRunner } from "typeorm";

export class BusStationsManyToMany1715422024881 implements MigrationInterface {
    name = 'BusStationsManyToMany1715422024881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "route_ab_stations_bus_station" ("routeId" integer NOT NULL, "busStationId" character varying NOT NULL, CONSTRAINT "PK_d3bbbc5bb65923c182ae4344d0a" PRIMARY KEY ("routeId", "busStationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_29cbf3c766991ca88a96acb188" ON "route_ab_stations_bus_station" ("routeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_93ccbf4aad8b608df690d364de" ON "route_ab_stations_bus_station" ("busStationId") `);
        await queryRunner.query(`CREATE TABLE "route_ba_stations_bus_station" ("routeId" integer NOT NULL, "busStationId" character varying NOT NULL, CONSTRAINT "PK_54c62594c5393afc49cdea547e2" PRIMARY KEY ("routeId", "busStationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_48d5906f6b386dd8bbda67bda1" ON "route_ba_stations_bus_station" ("routeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_eeec5ff06f30f8bcbb8cef8783" ON "route_ba_stations_bus_station" ("busStationId") `);
        await queryRunner.query(`ALTER TABLE "route" DROP COLUMN "ABStations"`);
        await queryRunner.query(`ALTER TABLE "route" DROP COLUMN "BAStations"`);
        await queryRunner.query(`ALTER TABLE "route_ab_stations_bus_station" ADD CONSTRAINT "FK_29cbf3c766991ca88a96acb1885" FOREIGN KEY ("routeId") REFERENCES "route"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "route_ab_stations_bus_station" ADD CONSTRAINT "FK_93ccbf4aad8b608df690d364de8" FOREIGN KEY ("busStationId") REFERENCES "bus_station"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "route_ba_stations_bus_station" ADD CONSTRAINT "FK_48d5906f6b386dd8bbda67bda1b" FOREIGN KEY ("routeId") REFERENCES "route"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "route_ba_stations_bus_station" ADD CONSTRAINT "FK_eeec5ff06f30f8bcbb8cef87832" FOREIGN KEY ("busStationId") REFERENCES "bus_station"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "route_ba_stations_bus_station" DROP CONSTRAINT "FK_eeec5ff06f30f8bcbb8cef87832"`);
        await queryRunner.query(`ALTER TABLE "route_ba_stations_bus_station" DROP CONSTRAINT "FK_48d5906f6b386dd8bbda67bda1b"`);
        await queryRunner.query(`ALTER TABLE "route_ab_stations_bus_station" DROP CONSTRAINT "FK_93ccbf4aad8b608df690d364de8"`);
        await queryRunner.query(`ALTER TABLE "route_ab_stations_bus_station" DROP CONSTRAINT "FK_29cbf3c766991ca88a96acb1885"`);
        await queryRunner.query(`ALTER TABLE "route" ADD "BAStations" character varying array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "route" ADD "ABStations" character varying array NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eeec5ff06f30f8bcbb8cef8783"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_48d5906f6b386dd8bbda67bda1"`);
        await queryRunner.query(`DROP TABLE "route_ba_stations_bus_station"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_93ccbf4aad8b608df690d364de"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_29cbf3c766991ca88a96acb188"`);
        await queryRunner.query(`DROP TABLE "route_ab_stations_bus_station"`);
    }

}
