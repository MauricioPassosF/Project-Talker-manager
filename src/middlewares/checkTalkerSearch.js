const validateSearchRate = ({ query }, res, next) => {
  if (query.rate 
   && (Number(query.rate) < 1 || Number(query.rate) > 5 || !Number.isInteger(Number(query.rate)))) {
    return res.status(400)
    .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }

  next();
};

const validateSearchDate = ({ query }, res, next) => {
  const isFormatDate = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  if (query.date 
    && (!isFormatDate.test(query.date))) {
    return res.status(400).json({ message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"' });
   }
  next();
};

module.exports = {
  validateSearchRate,
  validateSearchDate,
};