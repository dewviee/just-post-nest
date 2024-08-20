import { MigrationInterface, QueryRunner } from 'typeorm';

export class Generated1724132372171 implements MigrationInterface {
  name = 'Generated1724132372171';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_password_reset" ALTER COLUMN "is_use" SET DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_password_reset" ALTER COLUMN "is_use" SET DEFAULT 'false'`,
    );
  }
}
