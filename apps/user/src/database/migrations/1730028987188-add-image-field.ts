import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageField1730028987188 implements MigrationInterface {
    name = 'AddImageField1730028987188'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" ADD "image" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "image"`);
    }

}
