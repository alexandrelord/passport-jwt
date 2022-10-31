import { Request, Response } from 'express';
import { config } from '../config/config';
import jsonwebtoken from 'jsonwebtoken';
import User from '../models/User';
import { genPassword, issueJWT, validPassword } from '../utils/utils';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ msg: 'Could not find user' });
        }

        const isValid = validPassword(password, user.password.salt, user.password.hash);

        if (isValid) {
            const { refreshToken, accessToken } = issueJWT(user._id);

            res.cookie('jwt', refreshToken, { httpOnly: true, secure: true });
            return res.json({ accessToken });
        } else {
            res.status(401).json({ msg: 'You entered the wrong password' });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' });
    }
};

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
        return res.status(400).json({ msg: 'User already exists' });
    }

    const saltHash = genPassword(password);

    const newUser = new User({
        email: email,
        password: {
            salt: saltHash.salt,
            hash: saltHash.hash,
        },
    });

    try {
        const user = await newUser.save();
        const { refreshToken, accessToken } = issueJWT(user._id);

        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true });

        return res.json({ accessToken });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

export const refresh = async (req: Request, res: Response) => {
    if (req.cookies.jwt) {
        const { refreshToken } = req.cookies;

        try {
            const decoded = jsonwebtoken.verify(refreshToken, config.jwt.refreshTokenSecret);
            const user = await User.findById(decoded.sub);
            if (!user) {
                return res.status(401).json({ msg: 'User does not exist' });
            }
            const { accessToken } = issueJWT(user._id);

            return res.json({ accessToken });
        } catch (error) {
            return res.status(401).json({ msg: 'Refresh token is not valid' });
        }
    }
};
