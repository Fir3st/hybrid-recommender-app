import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedUsersRatings1541769549118 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE `users_ratings` (`id` int NOT NULL AUTO_INCREMENT, `userId` int NOT NULL, `movieId` int NOT NULL, `rating` float NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('ALTER TABLE `users_ratings` ADD CONSTRAINT `FK_928a0cfbfdb12562fdddb25a0a8` FOREIGN KEY (`userId`) REFERENCES `users`(`id`)');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `users_ratings` DROP FOREIGN KEY `FK_928a0cfbfdb12562fdddb25a0a8`');
        await queryRunner.query('DROP TABLE `users_ratings`');
    }

}
