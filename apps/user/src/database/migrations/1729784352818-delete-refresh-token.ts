import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteRefreshToken1729784352818 implements MigrationInterface {
  name = 'DeleteRefreshToken1729784352818';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP COLUMN "refresh_token"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD "refresh_token" character varying`,
    );
  }
}
