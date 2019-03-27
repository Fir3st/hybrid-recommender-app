import { Router } from 'express';
import { authenticate, authorize, authorizedOrCurrentUser } from '../middleware/auth';
import { getUsers, createUser, countUsers, getUser, getUserByID, getPreferences, deleteUser } from './users/basics';
import { getRecommendations, getRecommendationsByGenre } from './users/recommendations';

const router = Router();

router.get('/', [authenticate, authorize], getUsers);

router.post('/', createUser);

router.get('/count', [authenticate, authorize], countUsers);

router.get('/me', authenticate, getUser);

router.get('/:id', [authenticate, authorizedOrCurrentUser], getUserByID);

router.delete('/:id', [authenticate, authorize], deleteUser);

router.get('/:id/recommendations', [authenticate, authorizedOrCurrentUser], getRecommendations);

router.get('/:id/preferences', [authenticate, authorize], getPreferences);

router.get('/:userId/:genreId/recommendations', [authenticate, authorizedOrCurrentUser], getRecommendationsByGenre);

export default router;
