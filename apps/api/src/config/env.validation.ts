import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production', 'staging').default('development'),
  THROTTLE_TTL: Joi.number().required().default(60_000),
  THROTTLE_LIMIT: Joi.number().required().default(100),
  DB_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_SECRET_REFRESH: Joi.string().required(),
  ACCESS_EXPIRATION_TIME: Joi.number().required(),
  REFRESH_EXPIRATION_TIME: Joi.number().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
});
