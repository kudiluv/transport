import { MigrationInterface, QueryRunner } from "typeorm";

export class RouteSpeedInfo1711225930741 implements MigrationInterface {
    name = 'RouteSpeedInfo1711225930741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "AB" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "BA" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "position" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "position" TYPE geometry`);
        await queryRunner.query(`CREATE MATERIALIZED VIEW "route_speed_info_view" AS SELECT route.id AS "id", ST_ClosestPoint(ST_POINTS(route.fullRoute), "vehicle_position"."position") AS "closest", AVG("vehicle_position"."speed") AS "avgSpeed", COUNT(vehicle_position."position") AS "count" FROM (select ST_LineMerge(ST_COLLECT(route."AB", route."BA")) as fullRoute, id from route) "route", "vehicle_position" "vehicle_position" WHERE "vehicle_position"."historyTimestampId" > (select id from history_timestamp where history_timestamp.date >= NOW() - INTERVAL '10 min' limit 1) AND "vehicle_position"."prevPositionId" is not null AND ST_Distance(ST_POINTS(route.fullRoute), "vehicle_position"."position") < 0.001 AND ST_LineLocatePoint(route.fullRoute, "vehicle_position"."position") >
         ST_LineLocatePoint(route.fullRoute, (select position from vehicle_position vp2 where vp2.id = "vehicle_position"."prevPositionId")) AND ST_Distance("vehicle_position"."position", (select position from vehicle_position prev where prev.id = "vehicle_position"."prevPositionId")) < 0.001 GROUP BY route.id, closest`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","MATERIALIZED_VIEW","route_speed_info_view","SELECT route.id AS \"id\", ST_ClosestPoint(ST_POINTS(route.fullRoute), \"vehicle_position\".\"position\") AS \"closest\", AVG(\"vehicle_position\".\"speed\") AS \"avgSpeed\", COUNT(vehicle_position.\"position\") AS \"count\" FROM (select ST_LineMerge(ST_COLLECT(route.\"AB\", route.\"BA\")) as fullRoute, id from route) \"route\", \"vehicle_position\" \"vehicle_position\" WHERE \"vehicle_position\".\"historyTimestampId\" > (select id from history_timestamp where history_timestamp.date >= NOW() - INTERVAL '10 min' limit 1) AND \"vehicle_position\".\"prevPositionId\" is not null AND ST_Distance(ST_POINTS(route.fullRoute), \"vehicle_position\".\"position\") < 0.001 AND ST_LineLocatePoint(route.fullRoute, \"vehicle_position\".\"position\") >\n         ST_LineLocatePoint(route.fullRoute, (select position from vehicle_position vp2 where vp2.id = \"vehicle_position\".\"prevPositionId\")) AND ST_Distance(\"vehicle_position\".\"position\", (select position from vehicle_position prev where prev.id = \"vehicle_position\".\"prevPositionId\")) < 0.001 GROUP BY route.id, closest"]);
        await queryRunner.query(`CREATE INDEX "IDX_8fdf2b7ae407ac99b13c658ca0" ON "route_speed_info_view" ("id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_8fdf2b7ae407ac99b13c658ca0"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["MATERIALIZED_VIEW","route_speed_info_view","public"]);
        await queryRunner.query(`DROP MATERIALIZED VIEW "route_speed_info_view"`);
        await queryRunner.query(`ALTER TABLE "bus_station" ALTER COLUMN "position" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "vehicle_position" ALTER COLUMN "position" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "BA" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "route" ALTER COLUMN "AB" TYPE geometry(GEOMETRY,0)`);
    }

}
