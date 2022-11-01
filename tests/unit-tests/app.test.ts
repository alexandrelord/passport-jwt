import request from 'supertest';
import app from '../../src/app';

describe('404', () => {
    it('should return a 404 if the route does not exist', async () => {
        await request(app).get('/not-a-route').expect(404);
    });
});
