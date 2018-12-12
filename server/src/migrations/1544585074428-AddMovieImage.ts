import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMovieImage1544585074428 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `movies` ADD `image` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `users_ratings` CHANGE `rating` `rating` float NOT NULL");
        await queryRunner.query("ALTER TABLE `users_ratings` CHANGE `createdAt` `createdAt` datetime NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `users_ratings` CHANGE `createdAt` `createdAt` datetime(0) NOT NULL");
        await queryRunner.query("ALTER TABLE `users_ratings` CHANGE `rating` `rating` float(12) NOT NULL");
        await queryRunner.query("ALTER TABLE `movies` DROP COLUMN `image`");
    }

}
