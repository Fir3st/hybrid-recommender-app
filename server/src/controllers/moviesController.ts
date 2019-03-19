import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getCount, getMovieByID, getMovies, getTopMovies, search } from './movies/basics';
import { getRecommendations } from './movies/recommendations';
import { getMovieRatings, getAvgRating, getMovieRatingByID, rateMovie } from './movies/ratings';

const router = Router();

router.get('/', getMovies);

router.get('/search/:query', search);

router.get('/top', getTopMovies);

router.get('/count/:type', getCount);

router.get('/:id', getMovieByID);

router.get('/:id/recommendations', getRecommendations);

router.get('/:id/ratings', [authenticate, authorize], getMovieRatings);

router.get('/:id/avg-rating', getAvgRating);

router.get('/:id/rating', authenticate, getMovieRatingByID);

router.post('/:id/rating', authenticate, rateMovie);

export default router;
