import { MigrationInterface, QueryRunner } from 'typeorm';

export class PopulateSettingsTable1571045082161 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'general', name: 'take', value: '10' }).execute();

        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'cb', name: 'recType', value: 'tf-idf' }).execute();
        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'cb', name: 'orderBy', value: 'similarity,es_score' }).execute();

        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'cbf', name: 'recType', value: 'svd' }).execute();
        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'cbf', name: 'similarityType', value: null }).execute();
        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'cbf', name: 'similaritySource', value: 'tf-idf' }).execute();
        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'cbf', name: 'genre', value: '[]' }).execute();
        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'cbf', name: 'movieType', value: null }).execute();
        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'cbf', name: 'orderBy', value: 'rating,es_score' }).execute();

        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'hybrid', name: 'hybridType', value: 'weighted' }).execute();
        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'hybrid', name: 'recType', value: 'svd' }).execute();
        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'hybrid', name: 'similarityType', value: null }).execute();
        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'hybrid', name: 'similaritySource', value: 'tf-idf' }).execute();
        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'hybrid', name: 'genre', value: '[]' }).execute();
        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'hybrid', name: 'movieType', value: null }).execute();
        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'hybrid', name: 'orderBy', value: 'similarity,rating,es_score' }).execute();

        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'expert', name: 'recType', value: 'svd' }).execute();
        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'expert', name: 'similarityType', value: null }).execute();
        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'expert', name: 'similaritySource', value: 'tf-idf' }).execute();
        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'expert', name: 'genre', value: '[]' }).execute();
        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'expert', name: 'movieType', value: null }).execute();
        await queryRunner.manager.createQueryBuilder().insert().into('settings').values({ type: 'expert', name: 'orderBy', value: 'es_score,rating' }).execute();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('TRUNCATE TABLE `settings`');
    }

}
