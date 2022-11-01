import express from 'express';
import request from 'supertest';
import userRoute from '../../src/routes/users';
// import User from '../../src/models/user';
import { createUser, loginUser, StatusError } from '../../src/services/services';
import { setupDB } from '../helpers/helpers';

const app = express();

app.use(express.json());

setupDB();

app.use('/users', userRoute);

// Check refresh route tests, JS unable to access cookies due to httpOnly option

describe('users', () => {
    describe('register', () => {
        describe('success', () => {
            it('should return a 200 status code and a json response if the user is created', async () => {
                const response = await request(app).post('/users/register').send({ email: 'email', password: 'password' });
                expect(response.statusCode).toEqual(200);
                expect(response.type).toEqual('application/json');
            });
            it('should return an access token if user is created', async () => {
                const response = await request(app).post('/users/register').send({ email: 'email', password: 'password' });
                expect(response.body.accessToken).toBeDefined();
            });
            it('should return a refresh token in an HttpOnly cookie if user is created', async () => {
                const response = await request(app).post('/users/register').send({ email: 'email', password: 'password' });
                expect(response.headers['set-cookie'][0]).toContain('jwt');
                expect(response.headers['set-cookie'][0]).toContain('HttpOnly');
            });
        });
        describe('failure', () => {
            it('should throw an error if the email or password is not provided', async () => {
                const bodyData = [
                    { email: 'email', password: '' },
                    { email: '', password: 'password' },
                    { email: '', password: '' },
                ];
                for (const body of bodyData) {
                    await createUser(body.email, body.password).catch((error) => {
                        expect(error).toBeInstanceOf(StatusError);
                        expect(error.status).toBe(400);
                        expect(error.message).toBe('All fields are required');
                    });
                }
            });
            it('should throw an error if the user does not exist', async () => {
                await createUser('email', 'password').catch((error) => {
                    expect(error).toBeInstanceOf(StatusError);
                    expect(error.status).toBe(400);
                    expect(error.message).toBe('User already exists');
                });
            });
        });
    });
    describe('login', () => {
        describe('loginUser', () => {
            describe('success', () => {
                it('should return a 200 status code and a json response for logged in user', async () => {
                    // Create a user
                    await createUser('email', 'password');
                    // Login the user
                    const response = await request(app).post('/users/login').send({ email: 'email', password: 'password' });
                    expect(response.statusCode).toEqual(200);
                    expect(response.type).toEqual('application/json');
                });
                it('should return an access token if user is logged in', async () => {
                    // Create a user
                    await createUser('email', 'password');
                    // Login the user
                    const response = await request(app).post('/users/login').send({ email: 'email', password: 'password' });
                    expect(response.body.accessToken).toBeDefined();
                });
                it('should return a refresh token in an HttpOnly cookie if user is logged in', async () => {
                    // Create a user
                    await createUser('email', 'password');
                    // Login the user
                    const response = await request(app).post('/users/login').send({ email: 'email', password: 'password' });
                    expect(response.headers['set-cookie'][0]).toContain('jwt');
                    expect(response.headers['set-cookie'][0]).toContain('HttpOnly');
                });
            });
            describe('failure', () => {
                it('should throw an error if the email or password is not provided', async () => {
                    const bodyData = [
                        { email: 'email', password: '' },
                        { email: '', password: 'password' },
                        { email: '', password: '' },
                    ];
                    for (const body of bodyData) {
                        await loginUser(body.email, body.password).catch((error) => {
                            expect(error).toBeInstanceOf(StatusError);
                            expect(error.status).toBe(400);
                            expect(error.message).toBe('Email and password are required');
                        });
                    }
                });
                it('should throw and error if user does not exist in DB', async () => {
                    await loginUser('email', 'password').catch((error) => {
                        expect(error).toBeInstanceOf(StatusError);
                        expect(error.status).toBe(404);
                    });
                });
                it('should throw and error if password is incorrect', async () => {
                    await createUser('email', 'password');
                    await loginUser('email', 'incorrect').catch((error) => {
                        expect(error).toBeInstanceOf(StatusError);
                        expect(error.status).toBe(401);
                        expect(error.message).toBe('Invalid password');
                    });
                });
            });
        });
    });
    describe('protected', () => {
        describe('success', () => {
            it('should return a 200 status code and a json response for logged in user', async () => {
                // Create a user
                await createUser('email', 'password');
                // Login the user
                const response = await request(app).post('/users/login').send({ email: 'email', password: 'password' });
                // Get the access token
                const { accessToken } = response.body;
                // Send a request to the protected route with the access token
                const protectedResponse = await request(app).get('/users/protected').set('Authorization', `Bearer ${accessToken}`);
                expect(protectedResponse.statusCode).toEqual(200);
                expect(protectedResponse.type).toEqual('application/json');
            });
        });
        describe('failure', () => {
            it('should throw an error if the access token is not provided', async () => {
                await request(app)
                    .get('/users/protected')
                    .catch((error) => {
                        expect(error.status).toBe(401);
                    });
            });
            it('should throw an error if the access token is invalid', async () => {
                await request(app)
                    .get('/users/protected')
                    .set('Authorization', 'Bearer invalid')
                    .catch((error) => {
                        expect(error.status).toBe(401);
                    });
            });
        });
    });
    // describe('refresh', () => {
    //     describe('success', () => {
    //         it('should return a 200 status code and a json response for logged in user', async () => {
    //             // Create a user
    //             await createUser('email', 'password');
    //             // Login the user
    //             const response = await request(app).post('/users/login').send({ email: 'email', password: 'password' });
    //             // Get the refresh token
    //             const refreshToken = response.headers['set-cookie'][0].split('=')[1].split(';')[0];
    //             // Send a request to the refresh route with the refresh token
    //             const refreshResponse = await request(app).post('/users/refresh').set('Cookie', `jwt=${refreshToken}`);
    //             expect(refreshResponse.statusCode).toEqual(200);
    //             expect(refreshResponse.type).toEqual('application/json');
    //         });
    //     });
    // });
    // it('should return an access token if user is logged in', async () => {
    //     // Create a user
    //     const response = await request(app).post('/users/register').send({ email: 'email', password: 'password' });
    //     // Get the refresh token
    //     const refreshToken = response.headers['set-cookie'][0].split('=')[1].split(';')[0];
    //     // Send a request to the refresh route with the refresh token
    //     const refreshResponse = await request(app).post('/users/refresh').set('Cookie', `jwt=${refreshToken}`);
    //     expect(refreshResponse.body.accessToken).toBeDefined();
    // });
    // });
    // describe('failure', () => {
    //     it('should throw an error if the refresh token is not provided', async () => {
    //         await request(app)
    //             .post('/users/refresh')
    //             .catch((error) => {
    //                 expect(error.status).toBe(400);
    //                 expect(error.message).toBe('Refresh token is required');
    //             });
    //     });
    //     it('should throw an error if the refresh token is invalid', async () => {
    //         await request(app)
    //             .post('/users/refresh')
    //             .set('Cookie', 'jwt=invalid')
    //             .catch((error) => {
    //                 expect(error.status).toBe(401);
    //             });
    //     });
    //     it('should throw an error if the user does not exists in DB', async () => {
    //         // Create a user
    //         const response = await request(app).post('/users/register').send({ email: 'email', password: 'password' });
    //         // Get the refresh token
    //         const refreshToken = response.headers['set-cookie'][0].split('=')[1].split(';')[0];
    //         // Delete the user from DB
    //         await User.deleteOne({ email: 'email' });
    //         // Send a request to the refresh route with the refresh token
    //         await request(app)
    //             .post('/users/refresh')
    //             .set('Cookie', `jwt=${refreshToken}`)
    //             .catch((error) => {
    //                 expect(error.status).toBe(401);
    //                 expect(error.message).toBe('User does not exist');
    //             });
    //     });
    // });
});
