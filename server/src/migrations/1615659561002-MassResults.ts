import { MigrationInterface, QueryRunner } from 'typeorm';

export class MassResults1615659561002 implements MigrationInterface {
    name = 'MassResults1615659561002';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE `massResults` (`id` int NOT NULL AUTO_INCREMENT, `type` varchar(100) NOT NULL, `data` longtext NOT NULL, `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `massResults`');
    }

}
