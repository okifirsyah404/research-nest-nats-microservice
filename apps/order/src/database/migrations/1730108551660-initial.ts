import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1730108551660 implements MigrationInterface {
    name = 'Initial1730108551660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "grand_total" bigint NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sub_orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "quantity" smallint NOT NULL, "sub_total" bigint NOT NULL, "product_id" uuid NOT NULL, "order_id" uuid NOT NULL, CONSTRAINT "PK_909d792a7f7b751a851223dee9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sub_orders" ADD CONSTRAINT "FK_f6fdc0f65057389bcdb58575b9a" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sub_orders" DROP CONSTRAINT "FK_f6fdc0f65057389bcdb58575b9a"`);
        await queryRunner.query(`DROP TABLE "sub_orders"`);
        await queryRunner.query(`DROP TABLE "orders"`);
    }

}
