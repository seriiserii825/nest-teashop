import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1767110201123 implements MigrationInterface {
    name = 'Migration1767110201123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "UQ_0eb60311a81aad2495d55dc2090" UNIQUE ("title", "user_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "UQ_0eb60311a81aad2495d55dc2090"`);
    }

}
