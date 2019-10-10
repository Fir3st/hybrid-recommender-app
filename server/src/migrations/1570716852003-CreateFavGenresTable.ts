import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFavGenresTable1570716852003 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE `fav_genres` (`id` int NOT NULL AUTO_INCREMENT, `type` int NOT NULL, `userId` int NULL, `genreId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('ALTER TABLE `fav_genres` ADD CONSTRAINT `FK_6a2b0342fca0922db7612fb54a5` FOREIGN KEY (`userId`) REFERENCES `users`(`id`)');
        await queryRunner.query('ALTER TABLE `fav_genres` ADD CONSTRAINT `FK_aa2f74bc1eea4ff976a5009b910` FOREIGN KEY (`genreId`) REFERENCES `genres`(`id`)');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `fav_genres` DROP FOREIGN KEY `FK_aa2f74bc1eea4ff976a5009b910`');
        await queryRunner.query('ALTER TABLE `fav_genres` DROP FOREIGN KEY `FK_6a2b0342fca0922db7612fb54a5`');
        await queryRunner.query('DROP TABLE `fav_genres`');
    }

}
