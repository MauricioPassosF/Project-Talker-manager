const validateSearchRate = ({ query }, res, next) => {
  if (query.rate 
   && (Number(query.rate) < 1 || Number(query.rate) > 5 || !Number.isInteger(Number(query.rate)))) {
    return res.status(400)
    .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }

  next();
};

module.exports = {
  validateSearchRate,
};