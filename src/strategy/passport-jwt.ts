import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { config } from '../config/config';
import passport from 'passport';
import User from '../models/User';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt.accessTokenSecret,
};

const jwtStrategy = new JwtStrategy(opts, (jwtPayload, done) => {
    User.findOne({ _id: jwtPayload.sub }, async (err: any, user: any) => {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    });
});

export default passport.use(jwtStrategy);

// Behind the scenes:
// The passport.authenticate middleware is used to authenticate requests using the passport-jwt strategy.
// The middleware will check if the Authorization header is present and if the JWT is valid.
// If valid, the payload object is passed to the verify callback function, and we grab the id from the payload sub object.
// then the the user object is attached to the request object and the request is passed to the next middleware.
// If the JWT is not valid, the middleware will return a 401 Unauthorized response.

// The ExtractJwt.fromAuthHeader.... extracts the JWT from the Authorization header, expecting the JWT to be in the format Authorization: Bearer <token>

// The secretOrKey is used to verify the signature of the JWT. This is the same secret that was used to sign the JWT.

// jwt.payload.sub is the id of the user that was used to sign the JWT. We use this id to find the user in the database.

// The done callback is used to tell Passport that the authentication was successful or not. If the authentication was successful, the done callback is called with the user object. If the authentication was not successful, the done callback is called with false.
