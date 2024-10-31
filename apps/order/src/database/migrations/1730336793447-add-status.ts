import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatus1730336793447 implements MigrationInterface {
    name = 'AddStatus1730336793447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."orders_order_status_enum" AS ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'DELIVERED')`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "order_status" "public"."orders_order_status_enum" NOT NULL DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "order_status"`);
        await queryRunner.query(`DROP TYPE "public"."orders_order_status_enum"`);
    }

}
