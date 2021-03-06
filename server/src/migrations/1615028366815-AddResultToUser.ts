import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddResultToUser1615028366815 implements MigrationInterface {
    name = 'AddResultToUser1615028366815';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `users` ADD `massResult` text NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `users` DROP COLUMN `massResult`');
    }

}
