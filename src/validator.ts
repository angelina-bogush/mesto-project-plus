import { celebrate, Joi } from "celebrate";

export const avatar =
  /^(https?:\/\/)?([a-zA-Z0-9-._~:/?#[]@!$&'()*+,;=]+\.)*[a-zA-Z0-9-._~:/?#[]@!$&'()*+,;=]+#?$/;

export const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    email: Joi.string().email().required(),
    avatar: Joi.string().pattern(avatar),
    password: Joi.string().required(),
  }),
});
export const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
});
export const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({ avatar: Joi.string().pattern(avatar).required() }),
});
export const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required()
  }),
});
export const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

export const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(avatar).required(),
  }),
});

export const validateCardId = celebrate({
  params: Joi.object().keys({ cardId: Joi.string().length(24).hex().required() }),
});
