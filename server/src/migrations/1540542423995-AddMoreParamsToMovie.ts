import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMoreParamsToMovie1540542423995 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE `languages` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `ratings` (`id` int NOT NULL AUTO_INCREMENT, `source` varchar(100) NOT NULL, `value` varchar(10) NOT NULL, `movieId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `actors` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `movies_languages` (`languagesId` int NOT NULL, `moviesId` int NOT NULL, PRIMARY KEY (`languagesId`, `moviesId`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `movies_actors` (`moviesId` int NOT NULL, `actorsId` int NOT NULL, PRIMARY KEY (`moviesId`, `actorsId`)) ENGINE=InnoDB');
        await queryRunner.query('ALTER TABLE `movies` ADD `imdbId` varchar(20) NOT NULL');
        await queryRunner.query('ALTER TABLE `movies` ADD `plot` text NOT NULL');
        await queryRunner.query('ALTER TABLE `movies` ADD `country` varchar(5) NOT NULL');
        await queryRunner.query('ALTER TABLE `movies` ADD `poster` varchar(100) NOT NULL');
        await queryRunner.query("ALTER TABLE `movies` ADD `type` enum ('movie', 'episode') NOT NULL");
        await queryRunner.query('ALTER TABLE `movies` ADD `production` varchar(100) NOT NULL');
        await queryRunner.query('ALTER TABLE `ratings` ADD CONSTRAINT `FK_c10d219b6360c74a9f2186b76df` FOREIGN KEY (`movieId`) REFERENCES `movies`(`id`)');
        await queryRunner.query('ALTER TABLE `movies_languages` ADD CONSTRAINT `FK_5a9997ed49cb1786c58a8a1c166` FOREIGN KEY (`languagesId`) REFERENCES `languages`(`id`) ON DELETE CASCADE');
        await queryRunner.query('ALTER TABLE `movies_languages` ADD CONSTRAINT `FK_006d624c816ba35bd454e24242d` FOREIGN KEY (`moviesId`) REFERENCES `movies`(`id`) ON DELETE CASCADE');
        await queryRunner.query('ALTER TABLE `movies_actors` ADD CONSTRAINT `FK_d8b1b832dc2097cddfd6e9ef324` FOREIGN KEY (`moviesId`) REFERENCES `movies`(`id`) ON DELETE CASCADE');
        await queryRunner.query('ALTER TABLE `movies_actors` ADD CONSTRAINT `FK_7e36ac9a9ca0e920c39c4c7f454` FOREIGN KEY (`actorsId`) REFERENCES `actors`(`id`) ON DELETE CASCADE');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `movies_actors` DROP FOREIGN KEY `FK_7e36ac9a9ca0e920c39c4c7f454`');
        await queryRunner.query('ALTER TABLE `movies_actors` DROP FOREIGN KEY `FK_d8b1b832dc2097cddfd6e9ef324`');
        await queryRunner.query('ALTER TABLE `movies_languages` DROP FOREIGN KEY `FK_006d624c816ba35bd454e24242d`');
        await queryRunner.query('ALTER TABLE `movies_languages` DROP FOREIGN KEY `FK_5a9997ed49cb1786c58a8a1c166`');
        await queryRunner.query('ALTER TABLE `ratings` DROP FOREIGN KEY `FK_c10d219b6360c74a9f2186b76df`');
        await queryRunner.query('ALTER TABLE `movies` DROP COLUMN `production`');
        await queryRunner.query('ALTER TABLE `movies` DROP COLUMN `type`');
        await queryRunner.query('ALTER TABLE `movies` DROP COLUMN `poster`');
        await queryRunner.query('ALTER TABLE `movies` DROP COLUMN `country`');
        await queryRunner.query('ALTER TABLE `movies` DROP COLUMN `plot`');
        await queryRunner.query('ALTER TABLE `movies` DROP COLUMN `imdbId`');
        await queryRunner.query('DROP TABLE `movies_actors`');
        await queryRunner.query('DROP TABLE `movies_languages`');
        await queryRunner.query('DROP TABLE `actors`');
        await queryRunner.query('DROP TABLE `ratings`');
        await queryRunner.query('DROP TABLE `languages`');
    }

}
