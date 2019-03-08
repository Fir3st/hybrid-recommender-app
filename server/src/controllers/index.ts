import { Application } from 'express';
import usersController from './usersController';
import authenticationController from './authenticationController';
import moviesController from './moviesController';
import genresController from './genresController';

export default (app: Application) => {
    app.use('/auth', authenticationController);
    app.use('/users', usersController);
    app.use('/movies', moviesController);
    app.use('/genres', genresController);
};
