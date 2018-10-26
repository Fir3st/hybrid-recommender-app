import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMovieAndGenre1540539303709 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE `movies` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(100) NOT NULL, `year` int(4) NOT NULL, `rating` varchar(5) NOT NULL, `releaseDate` date NOT NULL, `director` varchar(100) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `genres` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE `genres`');
        await queryRunner.query('DROP TABLE `movies`');
    }

}
