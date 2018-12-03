import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePosterLength1543860079761 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `users_ratings` CHANGE `rating` `rating` float NOT NULL');
        await queryRunner.query('ALTER TABLE `users_ratings` CHANGE `createdAt` `createdAt` datetime NOT NULL');
        await queryRunner.query('ALTER TABLE `movies` DROP COLUMN `poster`');
        await queryRunner.query('ALTER TABLE `movies` ADD `poster` varchar(255) NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `movies` DROP COLUMN `poster`');
        await queryRunner.query('ALTER TABLE `movies` ADD `poster` varchar(100) NOT NULL');
        await queryRunner.query('ALTER TABLE `users_ratings` CHANGE `createdAt` `createdAt` datetime(0) NOT NULL');
        await queryRunner.query('ALTER TABLE `users_ratings` CHANGE `rating` `rating` float(12) NOT NULL');
    }

}
