import { Router } from 'express';
import { authenticate, authorize, authorizedOrCurrentUser } from '../middleware/auth';
import {
    getUsers,
    createUser,
    countUsers,
    getUser,
    getUserByID,
    getPreferences,
    deleteUser,
    sendQuestionnaire,
    sendResults,
    analyzeUser,
    getUserGroup
} from './users/basics';
import { getRecommendations } from './users/recommendations';

const router = Router();

router.get('/', [authenticate, authorize], getUsers);

router.post('/', createUser);

router.get('/count', countUsers);

router.get('/me', authenticate, getUser);

router.get('/:id', [authenticate, authorizedOrCurrentUser], getUserByID);

router.delete('/:id', [authenticate, authorize], deleteUser);

router.get('/:id/recommendations', [authenticate, authorizedOrCurrentUser], getRecommendations);

router.post('/:id/questionnaire', [authenticate, authorizedOrCurrentUser], sendQuestionnaire);

router.post('/:id/results', [authenticate, authorizedOrCurrentUser], sendResults);

router.get('/:id/preferences', [authenticate, authorize], getPreferences);

router.get('/:id/group', [authenticate, authorize], getUserGroup);

router.get('/:id/analyze', [authenticate, authorize], analyzeUser);

export default router;
