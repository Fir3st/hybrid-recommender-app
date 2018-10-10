import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { User } from '../entities/User';
import { validateRegister } from '../utils/validations/user';
import { authenticate } from '../middleware/auth';
const router = Router();

router.get('/', authenticate, async (req: Request, res: Response) => {
    const repository = getRepository(User);
    const all = await repository.find();
    const users = all.map(user => _.pick(user, ['id', 'name', 'surname', 'email', 'admin']));
    res.status(200).send({ users });
});

router.post('/', async (req: Request, res: Response) => {
    const { error, value: validated } = validateRegister(req.body);
    if (error) {
        return res.status(400).send({ message: 'Name, surname, email and password must be supplied' });
    }
    const userRepository = getRepository(User);
    const existing = await userRepository.findOne({ email: validated.email });
    if (existing) {
        return res.status(400).send({ message: 'User with given email already exists' });
    }
    const user = new User();
    user.name = validated.name;
    user.surname = validated.surname;
    user.email = validated.email;
    user.admin = (validated.admin !== undefined) ? validated.admin : true;
    try {
        user.password = await bcrypt.hash(validated.password, 10);
        const createdUser = await userRepository.save(user);
        return res.status(200).send(_.pick(createdUser, ['id', 'name', 'surname', 'email', 'admin']));
    } catch (error) {
        return res.status(500).send({ error });
    }
});

router.get('/me', authenticate, async (req: Request, res: Response) => {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ id: req.user.id });
    if (!user) {
        return res.status(400).send({ message: 'Authentication failed' });
    }
    return res.status(200).send({ user: _.pick(user, ['id', 'name', 'surname', 'email', 'admin']) });
});

export default router;
