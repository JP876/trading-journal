import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production', 'staging').default('development'),
  MONGO_URI: Joi.string().required(),
  MONGO_DB_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_SECRET_REFRESH: Joi.string().required(),
  ACCESS_EXPIRATION_TIME: Joi.number().required(),
  REFRESH_EXPIRATION_TIME: Joi.number().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  CLOUD_NAME: Joi.string().required(),
  CLOUD_API_KEY: Joi.string().required(),
  CLOUD_API_SECRET: Joi.string().required(),
});
