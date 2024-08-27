import { MigrationInterface, QueryRunner } from 'typeorm';

export class Generated1724761584577 implements MigrationInterface {
  name = 'Generated1724761584577';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post_entity" ADD "user_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "post_entity" ADD CONSTRAINT "FK_cc2b59f2109c123506cd2718c18" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_entity" DROP CONSTRAINT "FK_cc2b59f2109c123506cd2718c18"`,
    );
    await queryRunner.query(`ALTER TABLE "post_entity" DROP COLUMN "user_id"`);
  }
}
