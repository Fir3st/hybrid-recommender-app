import { MigrationInterface, QueryRunner } from 'typeorm';

export class resetSettings1611928915706 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('TRUNCATE TABLE settings');
        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'general', name: 'boosting_favourite', value: '0.5' }).execute();
        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'general', name: 'boosting_not_favourite', value: '0.5' }).execute();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
