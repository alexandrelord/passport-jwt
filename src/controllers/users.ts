import { Request, Response } from 'express';
import { decodeJWT, createUser, loginUser, StatusError } from '../services/services';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const { accessToken, refreshToken } = await loginUser(email, password);

        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true });

        return res.status(200).json({ accessToken });
    } catch (error) {
        if (error instanceof StatusError) {
            return res.status(error.status).json({ message: error.message });
        }
        return res.status(500).json({ error });
    }
};

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const { accessToken, refreshToken } = await createUser(email, password);

        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true });

        return res.status(200).json({ accessToken });
    } catch (error) {
        if (error instanceof StatusError) {
            return res.status(error.status).json({ message: error.message });
        }
        return res.status(500).json({ error });
    }
};

export const refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    try {
        const accessToken = await decodeJWT(refreshToken);

        return res.status(200).json({ accessToken });
    } catch (error) {
        if (error instanceof StatusError) {
            return res.status(error.status).json({ message: error.message });
        }
        return res.status(500).json({ error });
    }
};
