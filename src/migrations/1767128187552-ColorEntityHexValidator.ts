import { MigrationInterface, QueryRunner } from "typeorm";

export class ColorEntityHexValidator1767128187552 implements MigrationInterface {
    name = 'ColorEntityHexValidator1767128187552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "colors" ADD CONSTRAINT "UQ_cd6a0a7cdfee0e7f70f842610dd" UNIQUE ("name", "store_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "colors" DROP CONSTRAINT "UQ_cd6a0a7cdfee0e7f70f842610dd"`);
    }

}
