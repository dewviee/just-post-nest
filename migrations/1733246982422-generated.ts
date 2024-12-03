import { MigrationInterface, QueryRunner } from 'typeorm';

export class Generated1733246982422 implements MigrationInterface {
  name = 'Generated1733246982422';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post_like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "post_id" uuid, "user_id" uuid, CONSTRAINT "UQ_155b6bea641466e2d27ade96a4b" UNIQUE ("user_id", "post_id"), CONSTRAINT "PK_0e95caa8a8b56d7797569cf5dc6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_like" ADD CONSTRAINT "FK_a7ec6ac3dc7a05a9648c418f1ad" FOREIGN KEY ("post_id") REFERENCES "post_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_like" ADD CONSTRAINT "FK_c635b15915984c8cdb520a1fef3" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_like" DROP CONSTRAINT "FK_c635b15915984c8cdb520a1fef3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_like" DROP CONSTRAINT "FK_a7ec6ac3dc7a05a9648c418f1ad"`,
    );
    await queryRunner.query(`DROP TABLE "post_like"`);
  }
}
