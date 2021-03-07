import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMassOptionToSettings1615093320714 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'general', name: 'mass_generate', value: '0' }).execute();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
