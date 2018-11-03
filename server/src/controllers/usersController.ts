import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import winston from '../utils/winston';
import { User } from '../entities/User';
import { validateRegister } from '../utils/validations/user';
import { authenticate } from '../middleware/auth';
const router = Router();

router.get('/', authenticate, async (req: Request, res: any) => {
    const repository = getRepository(User);

    try {
        const users = await repository.find();

        if (users && users.length > 0) {
            return users.map(user => _.pick(user, ['id', 'name', 'surname', 'email', 'admin']));
        }

        return res.boom.badRequest('No users found');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.post('/', async (req: Request, res: any) => {
    const { error, value: validated } = validateRegister(req.body);
    const userRepository = getRepository(User);

    if (error) {
        return res.boom.badRequest('Name, surname, email and password must be supplied');
    }

    try {
        const existing = await userRepository.findOne({ email: validated.email });
        if (existing) {
            return res.boom.badRequest('User with given email already exists.');
        }

        const user = new User();
        user.name = validated.name;
        user.surname = validated.surname;
        user.email = validated.email;
        user.admin = (validated.admin !== undefined) ? validated.admin : true;
        user.password = await bcrypt.hash(validated.password, 10);

        const createdUser = await userRepository.save(user);
        return res.send(_.pick(createdUser, ['id', 'name', 'surname', 'email', 'admin']));
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

router.get('/me', authenticate, async (req: Request, res: any) => {
    const userRepository = getRepository(User);

    try {
        const user = await userRepository.findOne({ id: req.user.id });

        if (user) {
            return { user: _.pick(user, ['id', 'name', 'surname', 'email', 'admin']) };
        }

        return res.boom.badRequest('Authentication failed');
    } catch (error) {
        winston.error(error.message);
        return res.boom.internal();
    }
});

export default router;
