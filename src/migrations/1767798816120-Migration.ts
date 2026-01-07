import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1767798816120 implements MigrationInterface {
    name = 'Migration1767798816120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_d78303da2fa51a2354c97974273"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_bf96e1bdbc1ce2ec1f7fe66e8c2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_bf96e1bdbc1ce2ec1f7fe66e8c2"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "user_id" character varying`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_d78303da2fa51a2354c97974273" FOREIGN KEY ("userId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
