import { MigrationInterface, QueryRunner } from 'typeorm';

export class Generated1721387174303 implements MigrationInterface {
  name = 'Generated1721387174303';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying(500) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_58a149c4e88bf49036bc4c8c79f" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "post_entity"`);
  }
}
