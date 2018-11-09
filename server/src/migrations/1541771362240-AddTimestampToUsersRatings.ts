import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimestampToUsersRatings1541771362240 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `users_ratings` ADD `createdAt` datetime NOT NULL');
        await queryRunner.query('ALTER TABLE `users_ratings` CHANGE `rating` `rating` float NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `users_ratings` CHANGE `rating` `rating` float(12) NOT NULL');
        await queryRunner.query('ALTER TABLE `users_ratings` DROP COLUMN `createdAt`');
    }

}
