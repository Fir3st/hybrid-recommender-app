import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1539174262545 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, `surname` varchar(100) NOT NULL, `email` varchar(100) NOT NULL, `password` varchar(255) NOT NULL, `admin` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (`id`)) ENGINE=InnoDB');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE `users`');
    }

}
