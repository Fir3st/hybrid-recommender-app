import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import * as config from 'config';
import winston from '../utils/winston';
import { User } from '../entities/User';
import { validateLogin } from '../utils/validations/user';

const router = Router();

router.post('/login', async (req: Request, res: any) => {
    const { error, value: validated } = validateLogin(req.body);
    const repository = getRepository(User);

    if (error) {
        return res.boom.badRequest('Validation error.');
    }

    try {
        const user = await repository.findOne({ email: validated.email });
        if (!user) {
            return res.boom.badRequest('Invalid email or password');
        }

        const valid = await bcrypt.compare(validated.password, user.password);
        if (!valid) {
            return res.boom.badRequest('Invalid email or password');
        }

        const token = jwt.sign(_.pick(user, ['id', 'admin']), config.get('jwtSecret'));
        res.send({ token });
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.post('/logout', async (req: Request, res: any) => {
    res.boom.notImplemented();
});

export default router;
