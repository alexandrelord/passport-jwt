import express from 'express';
import request from 'supertest';
import userRoute from '../../src/routes/users';

const app = express();

app.use(express.json());

app.use('/users', userRoute);

describe('users', () => {
    describe('register', () => {
        it('should return a 400 if the email and/or password is missing', async () => {
            const bodyData = [{ email: 'email' }, { password: 'password' }, {}];
            for (const body of bodyData) {
                const response = await request(app).post('/users/register').send(body);
                expect(response.status).toBe(400);
            }
        });
        // it('should return a 200 if the user is created', async () => {
        //     const response = await request(app).post('/users/register').send({
        //         email: 'email',
        //         password: 'password',
        //     });
        //     expect(response.status).toBe(200);
        // });
        // it('should return a 400 if the email is already in use', () => {
        //     return request(app).post('users/register').send({ email: 'email', password: 'password' }).expect(400);
        // });
        // it('should specify json in the content-type header', async () => {
        //     const response = await request(app).post('/users/register').send({
        //         email: 'email',
        //         password: 'password',
        //     });
        //     expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        // });
        // it('should return a jwt in the body', async () => {
        //     const response = await request(app).post('/users/register').send({
        //         email: 'email',
        //         password: 'password',
        //     });
        //     expect(response.body).toHaveProperty('accessToken');
        // });
    });
    describe('login', () => {
        it('should return a 400 if the email and/or password is missing', async () => {
            const bodyData = [{ email: 'email' }, { password: 'password' }, {}];
            for (const body of bodyData) {
                const response = await request(app).post('/users/login').send(body);
                expect(response.status).toBe(400);
            }
        });
        // it('should return a 200 if the user is logged in', async () => {
        //     const response = await request(app).post('/users/login').send({
        //         email: 'email',
        //         password: 'password',
        //     });
        //     expect(response.status).toBe(200);
        // });
        // it('should return a 400 if the email is not in use', () => {
        //     return request(app).post('users/login').send({ email: 'email', password: 'password' }).expect(400);
        // });
        // it('should specify json in the content-type header', async () => {
        //     const response = await request(app).post('/users/login').send({
        //         email: 'email',
        //         password: 'password',
        //     });
        //     expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        // });
        // it('should return a jwt in the body', async () => {
        //     const response = await request(app).post('/users/login').send({
        //         email: 'email',
        //         password: 'password',
        //     });
        //     expect(response.body).toHaveProperty('accessToken');
        // });
    });
    // describe('refresh', () => {});
    // describe('protected', () => {});
});
