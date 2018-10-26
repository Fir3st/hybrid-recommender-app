import { agent, Response, SuperTest, Test } from 'supertest';
import app from '../../src/app';

const request: SuperTest<Test> = agent(app);

describe('GET /users', () => {
    it('should respond with status 401 if request is not authenticated', async () => {
        const response: Response = await request.get('/users');
        expect(response.status).toBe(401);
    });
});
