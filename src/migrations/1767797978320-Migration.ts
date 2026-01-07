import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1767797978320 implements MigrationInterface {
    name = 'Migration1767797978320'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" ADD "user_id" character varying`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_d78303da2fa51a2354c97974273" FOREIGN KEY ("userId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_d78303da2fa51a2354c97974273"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "user_id"`);
    }

}
