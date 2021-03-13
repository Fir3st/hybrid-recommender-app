import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveMassResultFromUsers1615658415516 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `users` DROP COLUMN `massResult`');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
