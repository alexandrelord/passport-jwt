import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import { config } from '../config/config';

/**
 *
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @returns {boolean} - Returns true if the password matches the hash
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hashed password stored in the DB with the password that the user provided at login
 *
 */
export const validPassword = (password: string, hash: string) => {
    const hashVerify = crypto.pbkdf2Sync(password, config.crypto.salt, 10000, 64, 'sha512').toString('hex');

    return hash === hashVerify;
};

// ----------------------------------------------

/**
 *
 * @param {*} password - The password string that the user inputs to the password field in the register form
 * @returns {string} - Returns the hashed password
 *
 * This function takes a plain text password and creates a hash out of it.  This is to prevent storing plain text passwords in the DB.
 *
 */

export const genPassword = (password: string) => {
    const genHash = crypto.pbkdf2Sync(password, config.crypto.salt, 10000, 64, 'sha512').toString('hex');

    return genHash;
};

// salting is a process of adding a random string of characters to the password before hashing it
// hashing is a process of converting a password into a string of characters that cannot be reversed

// --------------------------------------------------------------------------------

/**
 *
 * @param {*} _id - The user id
 * @returns {object} - Returns an object with the access token and refresh token
 *
 * This function creates a new access token and refresh token for the user. The access token is used to authenticate the user
 * and the refresh token is used to get a new access token when the current one expires.
 *
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
