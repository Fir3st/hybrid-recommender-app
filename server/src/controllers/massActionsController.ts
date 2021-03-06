import { authenticate, authorize } from '../middleware/auth';
import { Request, Router } from 'express';
import { getRepository } from 'typeorm';
import * as config from 'config';
import { User } from '../entities/User';
import winston from '../utils/winston';
const redisSmq = require('redis-smq');
const router = Router();

const queueConfig = config.get('redisQueue');
const producer = new redisSmq.Producer('retrain_queue', queueConfig);

router.post('/', [authenticate, authorize], async (req: Request, res: any) => {
    const usersRepository = getRepository(User);

    try {
        const users = await usersRepository.find({ take: 1 });

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
