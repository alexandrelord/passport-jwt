import express from 'express';
import passport from '../strategy/passport-jwt';
import { login, register, refresh } from '../controllers/users';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refresh);
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).json({
        msg: 'You are authorized',
    });
});

export default router;
