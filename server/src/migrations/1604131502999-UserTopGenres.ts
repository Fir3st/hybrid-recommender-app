import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserTopGenres1604131502999 implements MigrationInterface {
    name = 'UserTopGenres1604131502999';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `topGenres` (`id` int NOT NULL AUTO_INCREMENT, `genreType` enum ('most-rated', 'most-valued', 'least_rated', 'least_valued') NOT NULL DEFAULT 'most-rated', `genreLimit` enum ('top-three', 'top-twelve') NOT NULL DEFAULT 'top-three', `value` int NOT NULL, `genreId` int NULL, `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query('ALTER TABLE `topGenres` ADD CONSTRAINT `FK_02a54db8553e272270e6879290d` FOREIGN KEY (`genreId`) REFERENCES `genres`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `topGenres` ADD CONSTRAINT `FK_12a2f85028f796a343c3e328bd7` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `topGenres` DROP FOREIGN KEY `FK_12a2f85028f796a343c3e328bd7`');
        await queryRunner.query('ALTER TABLE `topGenres` DROP FOREIGN KEY `FK_02a54db8553e272270e6879290d`');
        await queryRunner.query('DROP TABLE `topGenres`');
    }

}
