import { Request, Response } from 'express';
import { config } from '../config/config';
import jsonwebtoken from 'jsonwebtoken';
import User from '../models/User';
import { genPassword, issueJWT, validPassword } from '../utils/utils';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ msg: 'could not find user' });
        }

        const isValid = validPassword(password, user.hash, user.salt!);

        if (isValid) {
            const { refreshToken, accessToken } = issueJWT(user);

            res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 24 });

            return res.json({ accessToken });
        } else {
            res.status(401).json({ msg: 'you entered the wrong password' });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' });
    }
};

export const register = async (req: Request, res: Response) => {
    const { password } = req.body;
    const saltHash = genPassword(password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        email: req.body.email,
        hash: hash,
        salt: salt,
    });

    try {
        const user = await newUser.save();
        const { refreshToken, accessToken } = issueJWT(user);

        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 24 });

        return res.json({ accessToken });
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' });
    }
};

export const refresh = async (req: Request, res: Response) => {
    if (req.cookies.jwt) {
        const { refreshToken } = req.cookies;

        jsonwebtoken.verify(refreshToken, config.jwt.refreshTokenSecret, (err: any, payload: any) => {
            if (err) {
                return res.sendStatus(403);
            }

            const user = User.findById(payload.sub);

            if (!user) {
                return res.sendStatus(403);
            }

            const { accessToken } = issueJWT(user);

            return res.json({ accessToken });
        });
    }
};
