import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUserIdIncrementLimit1558764189271 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE users AUTO_INCREMENT=1500');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
