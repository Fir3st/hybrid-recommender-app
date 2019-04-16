import { Router } from 'express';
import { authenticate, authorize, authorizedOrCurrentUser } from '../middleware/auth';
import { getUsers, createUser, countUsers, getUser, getUserByID, getPreferences, deleteUser, search } from './users/basics';
import { getRecommendations } from './users/recommendations';

const router = Router();

router.get('/', [authenticate, authorize], getUsers);

router.post('/', createUser);

router.get('/search', authenticate, search);

router.get('/count', [authenticate, authorize], countUsers);

router.get('/me', authenticate, getUser);

router.get('/:id', [authenticate, authorizedOrCurrentUser], getUserByID);

router.delete('/:id', [authenticate, authorize], deleteUser);

router.get('/:id/recommendations', [authenticate, authorizedOrCurrentUser], getRecommendations);

router.get('/:id/preferences', [authenticate, authorize], getPreferences);

export default router;
