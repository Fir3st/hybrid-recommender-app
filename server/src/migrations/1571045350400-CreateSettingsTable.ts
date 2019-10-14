import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSettingsTable1571045350400 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE `settings` (`id` int NOT NULL AUTO_INCREMENT, `type` varchar(100) NOT NULL, `name` varchar(100) NOT NULL, `value` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE `settings`');
    }

}
