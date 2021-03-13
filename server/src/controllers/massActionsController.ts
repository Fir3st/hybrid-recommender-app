import { authenticate, authorize } from '../middleware/auth';
import { Request, Router } from 'express';
import { getRepository } from 'typeorm';
import * as config from 'config';
import * as _ from 'lodash';
import { User } from '../entities/User';
import { Setting } from '../entities/Setting';
import winston from '../utils/winston';
const redisSmq = require('redis-smq');
const router = Router();

const queueConfig = config.get('redisQueue');
const producer = new redisSmq.Producer('retrain_queue', queueConfig);

router.get('/status', [authenticate, authorize], async (req: Request, res: any) => {
    const settingsRepository = getRepository(Setting);

    try {
        const massGenerateSetting = await settingsRepository.findOne({ name: 'mass_generate' });
        if (massGenerateSetting) {
            return res.send({ status: massGenerateSetting.value });
        }

        return res.send({ status: 'OK' });
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.get('/data', [authenticate, authorize], async (req: Request, res: any) => {
    const usersRepository = getRepository(User);

    try {
        const data = await usersRepository
            .createQueryBuilder()
            .where('massResult <> :massResult', { massResult: '' })
            .getMany();
        if (data && data.length) {
            return res.send({
                data: data
                    .map(item => _.pick(item, ['id', 'name', 'surname', 'massResult']))
                    .map(item => ({ ...item, massResult: JSON.parse(item.massResult) }))
            });
        }

        return res.send({ status: 'OK' });
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.post('/run', [authenticate, authorize], async (req: Request, res: any) => {
    const usersRepository = getRepository(User);

    try {
        const users = await usersRepository.find({ take: 2 });

        let msg = new redisSmq.Message();
        msg.setBody({ action: 'prepare' });

        producer.produceMessage(msg, (err) => {
            if (err) throw err;
        });

        for (const user of users) {
            msg = new redisSmq.Message();
            msg.setBody({ id: user.id });

            producer.produceMessage(msg, (err) => {
                if (err) throw err;
            });
        }

        msg = new redisSmq.Message();
        msg.setBody({ action: 'clean' });

        producer.produceMessage(msg, (err) => {
            if (err) throw err;
        });

        return res.send({ status: 'OK' });
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

export default router;
