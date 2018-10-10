import * as Joi from 'joi';
import { IJwtPayload } from '../types/jwtToken';

export const validate = (payload: any): Joi.ValidationResult<IJwtPayload> => {
    const schema = {
        id: Joi.number().min(0).required(),
        admin: Joi.boolean().required()
    };
    // JWT token usually contains other fields like "iat", allow them
    return Joi.validate(payload, schema, { allowUnknown: true });
};
