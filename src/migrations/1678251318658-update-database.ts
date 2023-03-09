import { MigrationInterface, QueryRunner } from "typeorm";

export class updateDatabase1678251318658 implements MigrationInterface {
    name = 'updateDatabase1678251318658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vouchers\` ADD \`code1\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vouchers\` DROP COLUMN \`code1\``);
    }

}
