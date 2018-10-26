import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMNTable1540539726944 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE `movies_genres` (`moviesId` int NOT NULL, `genresId` int NOT NULL, PRIMARY KEY (`moviesId`, `genresId`)) ENGINE=InnoDB');
        await queryRunner.query('ALTER TABLE `movies_genres` ADD CONSTRAINT `FK_490f84585d33963d5d7bdc34ec6` FOREIGN KEY (`moviesId`) REFERENCES `movies`(`id`) ON DELETE CASCADE');
        await queryRunner.query('ALTER TABLE `movies_genres` ADD CONSTRAINT `FK_91d9e376de22a2324b93d6eae62` FOREIGN KEY (`genresId`) REFERENCES `genres`(`id`) ON DELETE CASCADE');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `movies_genres` DROP FOREIGN KEY `FK_91d9e376de22a2324b93d6eae62`');
        await queryRunner.query('ALTER TABLE `movies_genres` DROP FOREIGN KEY `FK_490f84585d33963d5d7bdc34ec6`');
        await queryRunner.query('DROP TABLE `movies_genres`');
    }

}
