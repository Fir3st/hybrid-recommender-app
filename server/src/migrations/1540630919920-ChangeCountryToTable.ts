import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeCountryToTable1540630919920 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE `countries` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `movies_countries` (`countriesId` int NOT NULL, `moviesId` int NOT NULL, PRIMARY KEY (`countriesId`, `moviesId`)) ENGINE=InnoDB');
        await queryRunner.query('ALTER TABLE `movies` DROP COLUMN `country`');
        await queryRunner.query('ALTER TABLE `movies_countries` ADD CONSTRAINT `FK_a4842f143a4573c373eec7b026c` FOREIGN KEY (`countriesId`) REFERENCES `countries`(`id`) ON DELETE CASCADE');
        await queryRunner.query('ALTER TABLE `movies_countries` ADD CONSTRAINT `FK_9ef61b82a559a615f84f9490a63` FOREIGN KEY (`moviesId`) REFERENCES `movies`(`id`) ON DELETE CASCADE');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `movies_countries` DROP FOREIGN KEY `FK_9ef61b82a559a615f84f9490a63`');
        await queryRunner.query('ALTER TABLE `movies_countries` DROP FOREIGN KEY `FK_a4842f143a4573c373eec7b026c`');
        await queryRunner.query('ALTER TABLE `movies` ADD `country` varchar(50) NOT NULL');
        await queryRunner.query('DROP TABLE `movies_countries`');
        await queryRunner.query('DROP TABLE `countries`');
    }

}
