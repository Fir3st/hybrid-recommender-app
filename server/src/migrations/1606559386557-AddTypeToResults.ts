import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTypeToResults1606559386557 implements MigrationInterface {
    name = 'AddTypeToResults1606559386557';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `results` ADD `resultType` int NOT NULL DEFAULT 0');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `results` DROP COLUMN `resultType`');
    }

}
