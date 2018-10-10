import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import * as config from 'config';
import { User } from '../entities/User';
import { validateLogin } from '../utils/validations/user';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
    const { error, value: validated } = validateLogin(req.body);
    if (error) {
        return res.status(400).send({ message: 'Validation error' });
    }
    const repository = getRepository(User);
    const user = await repository.findOne({ email: validated.email });
    if (!user) {
        return res.status(400).send({ message: 'Invalid email or password' });
    }
    const valid = await bcrypt.compare(validated.password, user.password);
    if (!valid) {
        return res.status(400).send({ message: 'Invalid email or password' });
    }
    const token = jwt.sign(_.pick(user, ['id', 'admin']), config.get('jwtSecret'));
    res.status(200).send({ token });
});

router.post('/logout', async (req: Request, res: Response) => {
    res.status(501).send({ message: 'Not implemented yet' });
});

export default router;
