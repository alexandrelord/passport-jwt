import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import { config } from '../config/config';
import User from '../models/user';

/**
 * @param {*} password - The plain text password
 * @param {*} salt - The salt stored in the database
 * @param {*} hash - The hash stored in the database
 * @returns {boolean} - Returns true if the password matches the hash
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hashed password stored in the DB with the password that the user provided at login
 */
export const validPassword = (password: string, salt: string, hash: string) => {
    const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return hash === hashVerify;
};

// ----------------------------------------------

/**
 * @param {*} password - The password string that the user inputs to the password field in the register form
 * @returns {object} - Returns the salt and hash of the password
 *
 * This function takes a plain text password and creates a hash out of it.
 */

export const genPassword = (password: string) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return {
        salt,
        hash: genHash,
    };
};

// salting is a process of adding a random string of characters to the password before hashing it
// hashing is a process of converting a password into a string of characters that cannot be reversed

// --------------------------------------------------------------------------------

/**
 * @param {*} _id - The user id
 * @returns {object} - Returns an object with the access token and refresh token
 *
 * This function creates a new access token and refresh token for the user.
 */

export const issueJWT = (_id: string) => {
    const payload = {
        sub: _id,
        iat: Date.now(),
    };

    const accessToken = jsonwebtoken.sign(payload, config.jwt.accessTokenSecret, { expiresIn: '10m' });
    const refreshToken = jsonwebtoken.sign(payload, config.jwt.refreshTokenSecret, { expiresIn: '1d' });

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
};

// --------------------------------------------------------------------------------

/**
 * @param {*} email - The email of the user
 * @param {*} password - The password of the user
 * @returns {object} - Returns an object with the access token and refresh token
 *
 * This function logs in the user and returns the access token and refresh token
 **/

export const loginUser = async (email: string, password: string) => {
    if (!email || !password) {
        throw new StatusError('Email and password are required', 400);
    }

    const user = await findUser(email);

    if (!user) {
        throw new StatusError('User does not exist', 404);
    }

    const isValid = validPassword(password, user.password.salt, user.password.hash);

    if (!isValid) {
        throw new StatusError('Invalid password', 401);
    }
    const { refreshToken, accessToken } = issueJWT(user._id);

    return { refreshToken, accessToken };
};

// --------------------------------------------------------------------------------

/**
 * @param {*} email - The email of the user
 * @param {*} password - The password of the user
 * @returns {object} - Returns an object with the access token and refresh token
 *
 * This function creates a new user and returns the access token and refresh token
 */

export const createUser = async (email: string, password: string) => {
    if (!email || !password) {
        throw new StatusError('All fields are required', 400);
    }

    const user = await findUser(email);
    if (user) {
        throw new StatusError('User already exists', 400);
    }

    const { salt, hash } = genPassword(password);

    const newUser = new User({
        email: email,
        password: {
            salt: salt,
            hash: hash,
        },
    });

    await newUser.save();

    const { refreshToken, accessToken } = issueJWT(newUser._id);

    return { refreshToken, accessToken };
};

// --------------------------------------------------------------------------------

/**
 * @param {*} email - The email of the user
 * @returns {object} - Returns the user object
 *
 * This function finds a user by email
 */

export const findUser = async (email: string) => {
    return await User.findOne({ email: email });
};

// --------------------------------------------------------------------------------

/**
 * @param {*} token - The refresh token
 * @returns {string} accessToken - Returns the access token
 *
 * This function takes the refresh token and returns the access token
 **/

export const decodeJWT = async (token: string) => {
    if (!token) {
        throw new StatusError('Refresh token is required', 400);
    }

    const decoded = jsonwebtoken.verify(token, config.jwt.refreshTokenSecret);

    const user = await User.findById(decoded.sub);
    if (!user) {
        throw new StatusError('User does not exist', 401);
    }

    const { accessToken } = issueJWT(user._id);

    return accessToken;
};

// --------------------------------------------------------------------------------

/**
 *
 * StatusError class
 *
 */

export class StatusError extends Error {
    constructor(public message: string, public status: number) {
        super(message);
    }
}

// --------------------------------------------------------------------------------
