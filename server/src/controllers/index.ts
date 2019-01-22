import { Application, Request, Response } from 'express';
import usersController from './usersController';
import authenticationController from './authenticationController';
import moviesController from './moviesController';
import genresController from './genresController';
import { authenticate, admin } from '../middleware/auth';

export default (app: Application) => {
    app.use('/auth', authenticationController);
    app.use('/users', usersController);
    app.use('/movies', moviesController);
    app.use('/genres', genresController);
    app.get('/protected', authenticate, (req: Request, res: Response) => {
        console.log('Inside protected');
        return res.sendStatus(200);
    });
    // for routes requiring user to be admin, you can use "[authenticate, authorize]" or its alias "admin"
    app.get('/protected/admin', admin, (req: Request, res: Response) => {
        console.log('Inside ADMIN protected');
        return res.sendStatus(200);
    });
};
