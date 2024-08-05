import { MigrationInterface, QueryRunner } from 'typeorm';

export class Generated1722548241021 implements MigrationInterface {
  name = 'Generated1722548241021';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "session_refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying(500) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "expired_at" TIMESTAMP WITH TIME ZONE NOT NULL, "user_id" uuid, CONSTRAINT "PK_40608952c16dcdec611214d980a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "session_access_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying(500) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "expired_at" TIMESTAMP WITH TIME ZONE NOT NULL, "refresh_token_id" uuid, CONSTRAINT "PK_8988a9960f007e522bbf24fe6c5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "session_refresh_token" ADD CONSTRAINT "FK_781086e2ea6462b1befdd7b97e4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session_access_token" ADD CONSTRAINT "FK_b0de6771684235362629d17e8fa" FOREIGN KEY ("refresh_token_id") REFERENCES "session_refresh_token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session_access_token" DROP CONSTRAINT "FK_b0de6771684235362629d17e8fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session_refresh_token" DROP CONSTRAINT "FK_781086e2ea6462b1befdd7b97e4"`,
    );
    await queryRunner.query(`DROP TABLE "session_access_token"`);
    await queryRunner.query(`DROP TABLE "session_refresh_token"`);
  }
}
