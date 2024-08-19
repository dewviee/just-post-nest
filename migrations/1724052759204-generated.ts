import { MigrationInterface, QueryRunner } from 'typeorm';

export class Generated1724052759204 implements MigrationInterface {
  name = 'Generated1724052759204';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_password_reset" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "expired_at" TIMESTAMP WITH TIME ZONE NOT NULL, "is_use" boolean NOT NULL DEFAULT 'false', "user_id" uuid, CONSTRAINT "UQ_a53e5d9ab118cc964318b3f7297" UNIQUE ("token"), CONSTRAINT "PK_e26c0a588d5034bd66d7c3c5747" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_password_reset" ADD CONSTRAINT "FK_b012a45bf857801503a25a9a67f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_password_reset" DROP CONSTRAINT "FK_b012a45bf857801503a25a9a67f"`,
    );
    await queryRunner.query(`DROP TABLE "user_password_reset"`);
  }
}
