import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsersRatingToMovie1541771125893 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `users_ratings` CHANGE `rating` `rating` float NOT NULL');
        await queryRunner.query('ALTER TABLE `users_ratings` ADD CONSTRAINT `FK_c8ea24a5efb551cce4c07d2c701` FOREIGN KEY (`movieId`) REFERENCES `movies`(`id`)');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `users_ratings` DROP FOREIGN KEY `FK_c8ea24a5efb551cce4c07d2c701`');
        await queryRunner.query('ALTER TABLE `users_ratings` CHANGE `rating` `rating` float(12) NOT NULL');
    }

}
