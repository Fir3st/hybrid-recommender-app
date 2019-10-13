import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateResultsTable1570950508807 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE `results` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime NOT NULL, `userId` int NOT NULL, `data` longtext NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('ALTER TABLE `results` ADD CONSTRAINT `FK_c435fd895ea26113b42e65d0b52` FOREIGN KEY (`userId`) REFERENCES `users`(`id`)');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE `results` DROP FOREIGN KEY `FK_c435fd895ea26113b42e65d0b52`');
        await queryRunner.query('DROP TABLE `results`');
    }

}
