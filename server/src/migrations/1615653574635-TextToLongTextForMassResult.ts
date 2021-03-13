import { MigrationInterface, QueryRunner } from 'typeorm';

export class TextToLongTextForMassResult1615653574635 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `users` MODIFY `massResult` LONGTEXT');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
