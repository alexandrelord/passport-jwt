import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import { config } from '../config/config';

/**
 *
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
export const validPassword = (password: string, hash: string | undefined, salt: string) => {
    const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return hash === hashVerify;
};

// ----------------------------------------------

/**
 *
 * @param {*} password - The password string that the user inputs to the password field in the register form
 *
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security.
 *
 * @returns {object} - Returns an object with a salt and hash property
 *
 */

export const genPassword = (password: string) => {
    const salt = crypto.randomBytes(32).toString('hex');
    const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return {
        salt: salt,
        hash: genHash,
    };
};

// The genPassword function takes a password as a parameter and returns an object with a salt and hash property.

// salting is a process of adding a random string of characters to the password before hashing it
// hashing is a process of converting a password into a string of characters that cannot be reversed

// randomBytes is a function that returns a buffer of random bytes
// pbkdf2Sync is a function that takes a password, a salt, a number of iterations, a key length, and a digest algorithm and returns a buffer of derived key

// --------------------------------------------------------------------------------

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */

export const issueJWT = (user: any) => {
    const _id = user._id;

    const payload = {
        sub: _id,
        iat: Date.now(),
    };

    // create access token
    const accessToken = jsonwebtoken.sign(payload, config.jwt.accessTokenSecret, { expiresIn: '10m' });

    // create refresh token
    const refreshToken = jsonwebtoken.sign(payload, config.jwt.refreshTokenSecret, { expiresIn: '1d' });

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
};

// The issueJWT function takes a user object as a parameter and returns an object with a token and expires property.

// The expiresIn option is used to set the JWT expiration time.

// The sub property is used to store the user ID from the MongoDB database.
// The iat property is used to store the time when the JWT was issued.

// The payload object is used to set the JWT payload.  The JWT payload is a JSON object that contains information about the user.  The JWT payload is encoded and sent to the client in the JWT.

// The signedToken variable is used to store the signed JWT.  The jsonwebtoken.sign function is used to sign the JWT.  The first parameter is the payload object.  The second parameter is the secret used to sign the JWT.  The third parameter is an object with the expiresIn and algorithm options.

// The token property is used to store the JWT in the Authorization header in the format Authorization: Bearer <token>.  The token property is returned in the response body.

// The expires property is used to store the JWT expiration time.  The expires property is returned in the response body.
