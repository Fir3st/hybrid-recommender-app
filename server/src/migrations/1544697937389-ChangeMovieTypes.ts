import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeMovieTypes1544697937389 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE movies MODIFY type ENUM(\'movie\', \'episode\', \'series\') NOT NULL');
        await queryRunner.query('UPDATE movies SET type = \'series\' WHERE type = \'\'');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('UPDATE movies SET type = \'\' WHERE type = \'series\'');
        await queryRunner.query('ALTER TABLE movies MODIFY type ENUM(\'movie\', \'episode\') NOT NULL');
    }

}
