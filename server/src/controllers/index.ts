import { Application } from 'express';
import usersController from './usersController';
import authenticationController from './authenticationController';
import moviesController from './moviesController';
import genresController from './genresController';
import analyticsController from './analyticsController';
import ratingsController from './ratingsController';
import dataController from './dataController';
import playgroundController from './playgroundController';
import resultsController from './resultsController';
import groupsController from './groupsController';
import settingsController from './settingsController';

export default (app: Application) => {
    app.use('/auth', authenticationController);
    app.use('/users', usersController);
    app.use('/movies', moviesController);
    app.use('/genres', genresController);
    app.use('/analytics', analyticsController);
    app.use('/data', dataController);
    app.use('/ratings', ratingsController);
    app.use('/playground', playgroundController);
    app.use('/results', resultsController);
    app.use('/groups', groupsController);
    app.use('/settings', settingsController);
};
