import * as _ from 'lodash';
import { Request, Router } from 'express';
import { getRepository } from 'typeorm';
import winston from '../utils/winston';
import { authenticate, authorize } from '../middleware/auth';
import { Result } from '../entities/Result';
import { Genre } from '../entities/Genre';
import { Setting } from '../entities/Setting';
const router = Router();

router.get('/settings', [authenticate], async (req: Request, res: any) => {
    const repository = getRepository(Setting);
    const defaultSettings = {
        general: {},
        cb: {},
        cbf: {},
        hybrid: {},
        expert: {}
    };

    try {
        const settings = await repository
            .createQueryBuilder('settings')
            .getMany();

        if (settings && settings.length > 0) {
            for (const setting of settings) {
                defaultSettings[setting.type][setting.name] = setting.name === 'genre' ? JSON.parse(setting.value) : setting.value;
            }
            return res.send(defaultSettings);
        }

        return res.boom.badRequest('No settings found.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.post('/settings', [authenticate, authorize], async (req: Request, res: any) => {
    const repository = getRepository(Setting);
    const sentSettings = req.body.settings;
    const types = Object.keys(sentSettings);

    for (const type of types) {
        const typeSettings = Object.keys(sentSettings[type]);
        for (const typeSetting of typeSettings) {
            const value = sentSettings[type][typeSetting];

            const setting = await repository
                .createQueryBuilder('setting')
                .where('type = :type', { type })
                .andWhere('name = :name ', { name: typeSetting })
                .getOne();

            if (setting) {
                setting.value = typeSetting === 'genre' ? JSON.stringify(value) : value;
                await repository.save(setting);
            }
        }
    }

    try {
        return res.send({ message: 'Settings changed.' });
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.get('/', [authenticate, authorize], async (req: Request, res: any) => {
    const repository = getRepository(Result);

    try {
        const results = await repository
            .createQueryBuilder('results')
            .leftJoinAndSelect('results.user', 'user')
            .select(['results.id', 'results.createdAt', 'user.name', 'user.surname'])
            .where('resultType = :type', { type: 1 })
            .orderBy('createdAt', 'DESC')
            .getMany();

        if (results && results.length > 0) {
            return res.send(results);
        }

        return res.boom.badRequest('No results found.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.get('/:id', [authenticate, authorize], async (req: Request, res: any) => {
    const repository = getRepository(Result);
    const genresRepository = getRepository(Genre);
    const id = req.params.id;

    try {
        const result = await repository
            .createQueryBuilder('results')
            .leftJoinAndSelect('results.user', 'user')
            .where('results.id = :id', { id })
            .getOne();

        if (result) {
            const data = JSON.parse(result.data);
            const { favouriteGenres, notFavouriteGenres, items, results, settings, top3, least3, top12, least12 } = data;

            const response = {
                settings,
                favouriteGenres,
                notFavouriteGenres,
                results,
                top3,
                least3,
                top12,
                least12,
                id: result.id,
                createdAt: result.createdAt,
                user: _.omit(result.user, ['password', 'admin', 'email']),
                items: items.map(item => _.pick(item, ['id', 'title', 'rating']))
            };
            return res.send(response);
        }

        return res.boom.badRequest('No results found.');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.delete('/:id', [authenticate, authorize], async (req: Request, res: any) => {
    const repository = getRepository(Result);
    const id = req.params.id;

    try {
        const result = await repository
            .createQueryBuilder('results')
            .where('results.id = :id', { id })
            .getOne();

        if (result) {
            await repository.delete(result);
            return res.send({ message: 'Result deleted from database.' });
        }

        return res.boom.badRequest(`No result with id ${id} found.`);
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

export default router;
