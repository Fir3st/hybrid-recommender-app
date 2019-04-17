import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getCount, getMovieByID, getMovies, getTopMovies } from './movies/basics';
import { search, securedSearch } from './movies/search';
import { getRecommendations } from './movies/recommendations';
import { getMovieRatings, getAvgRating, getMovieRatingByID, rateMovie } from './movies/ratings';

const router = Router();

router.get('/', getMovies);

router.get('/search', search);

router.get('/secured-search', authenticate, securedSearch);

router.get('/top', getTopMovies);

router.get('/count/:type', getCount);

router.get('/:id', getMovieByID);

router.get('/:id/recommendations', getRecommendations);

router.get('/:id/ratings', [authenticate, authorize], getMovieRatings);

router.get('/:id/avg-rating', getAvgRating);

router.get('/:id/rating', authenticate, getMovieRatingByID);

router.post('/:id/rating', authenticate, rateMovie);

export default router;
