const z = require('zod');

const validateEmail = ({ body }, res, next) => {
  const { email } = body;
  const emailSchema = z.string().email();
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!emailSchema.safeParse(email).success) {
    return res
      .status(400)
      .json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  next();
};

const validatePassword = ({ body }, res, next) => {
  const { password } = body;
  if (!password) {
    return res
      .status(400)
      .json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};
module.exports = {
  validateEmail,
  validatePassword,
};
