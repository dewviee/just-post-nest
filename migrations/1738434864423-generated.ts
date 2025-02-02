import { MigrationInterface, QueryRunner } from 'typeorm';

export class Generated1738434864423 implements MigrationInterface {
  name = 'Generated1738434864423';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "todo_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" smallint NOT NULL, "content" character varying(255) NOT NULL, "todo_id" uuid, CONSTRAINT "PK_7ad331e73b03da55c148c2b5595" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "todos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "user_id" uuid, CONSTRAINT "PK_ca8cafd59ca6faaf67995344225" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "todo_items" ADD CONSTRAINT "FK_d6c3d2060f1b39a96c8a41048de" FOREIGN KEY ("todo_id") REFERENCES "todos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "todos" ADD CONSTRAINT "FK_53511787e1f412d746c4bf223ff" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "todos" DROP CONSTRAINT "FK_53511787e1f412d746c4bf223ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "todo_items" DROP CONSTRAINT "FK_d6c3d2060f1b39a96c8a41048de"`,
    );
    await queryRunner.query(`DROP TABLE "todos"`);
    await queryRunner.query(`DROP TABLE "todo_items"`);
  }
}
