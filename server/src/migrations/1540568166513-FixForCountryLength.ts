import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixForCountryLength1540568166513 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `movies` DROP COLUMN `country`');
        await queryRunner.query('ALTER TABLE `movies` ADD `country` varchar(50) NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `movies` DROP COLUMN `country`');
        await queryRunner.query('ALTER TABLE `movies` ADD `country` varchar(5) NOT NULL');
    }

}
