import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request, Response, Handler, NextFunction, RequestHandler } from 'express';
import * as passport from 'passport';
import * as config from 'config';
import { validate } from '../utils/validations/jwtToken';

const strategy = new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.get('jwtSecret')
}, (jwtPayload, callback) => {
    const { error, value } = validate(jwtPayload);
    if (error) {
        return callback(null, false);
    }
    callback(null, {
        id: value.id,
        admin: value.admin
    });
});
passport.use(strategy);

export function initializePassport(): Handler {
    return passport.initialize();
}

export function authenticate(req: Request, res: Response, next: NextFunction): any {
    passport.authenticate('jwt', { session: false })(req, res, next);
}

export function authorize(req: Request, res: Response, next: NextFunction): any {
    if (!req.user.admin) {
        return res.status(403).send({ message: 'You do not have the required permission for this action' });
    }
    next();
}

export const admin: RequestHandler[] = [authenticate, authorize];
