import express from 'express';
import request from 'supertest';
import userRoute from '../../src/routes/users';
import { createUser, loginUser, StatusError } from '../../src/services/services';

const app = express();

app.use(express.json());

app.use('/users', userRoute);

describe('users', () => {
    describe('register', () => {
        describe('createUser', () => {
            // describe('success', () => {
            //     it('should return an accessToken and refreshToken if the user is authenticated', async () => {
            //         const { accessToken, refreshToken } = await loginUser('email', 'password');
            //         expect(accessToken).toBeTruthy();
            //         expect(refreshToken).toBeTruthy();
            //     });
            // });
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
                            expect(error.message).toBe('Email and password are required');
                        });
                    }
                });
                // it('should throw an error if the user does not exist', async () => {
                //     await loginUser('email', 'password').catch((error) => {
                //         expect(error).toBeInstanceOf(StatusError);
                //         expect(error.status).toBe(404);
                //         expect(error.message).toBe('User does not exist');
                //     });
                // });
            });
        });
    });
    describe('login', () => {
        describe('loginUser', () => {
            // describe('success', () => {
            //     it('should return an accessToken and refreshToken if the user is authenticated', async () => {
            //         const { accessToken, refreshToken } = await loginUser('email', 'password');
            //         expect(accessToken).toBeTruthy();
            //         expect(refreshToken).toBeTruthy();
            //     });
            // });
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
                // it('should throw and error if user does not exist in DB', async () => {
                //     await loginUser('email', 'password').catch((error) => {
                //         expect(error).toBeInstanceOf(StatusError);
                //         expect(error.status).toBe(404);
                //     });
                // });
                // it('should throw and error if password is incorrect', async () => {
                //     await createUser('email', 'password');
                //     await loginUser('email', 'incorrect').catch((error) => {
                //         expect(error).toBeInstanceOf(StatusError);
                //         expect(error.status).toBe(401);
                //     });
                // });
            });
        });
    });
    // describe('refresh', () => {});
    // describe('protected', () => {});
});
