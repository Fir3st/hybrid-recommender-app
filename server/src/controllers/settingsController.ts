import { authenticate, authorize } from '../middleware/auth';
import { Request, Router } from 'express';
import { getRepository } from 'typeorm';
import { Setting } from '../entities/Setting';
import winston from '../utils/winston';
const router = Router();

router.get('/', [authenticate], async (req: Request, res: any) => {
    const repository = getRepository(Setting);
    const defaultSettings = {
        general: {}
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

router.post('/', [authenticate, authorize], async (req: Request, res: any) => {
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
                setting.value = value;
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

export default router;
