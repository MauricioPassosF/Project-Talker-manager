const validateTalkerName = ({ body }, res, next) => {
  const { name } = body;
  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
    return res
      .status(400)
      .json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
};

const validateTalkerAge = ({ body }, res, next) => {
  const { age } = body;
  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  if (typeof age !== 'number' || age < 18 || !Number.isInteger(age)) {
    return res
      .status(400)
      .json({
        message:
          'O campo "age" deve ser um número inteiro igual ou maior que 18',
      });
  }
  next();
};

const validateTalkInfo = ({ body }, res, next) => {
  const { talk } = body;
  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
  next();
};

const getRate = (body) => (body.talk ? body.talk.rate : body.rate);

const validateTalkRate = ({ body }, res, next) => {
  // const { talk } = body;

  const rate = getRate(body);

  if (rate === undefined) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }

  if (rate < 1 || rate > 5 || !Number.isInteger(rate)) {
    return res
      .status(400)
      .json({
        message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
      });
  }

  next();
};

const validateTalkDate = ({ body }, res, next) => {
  const { talk } = body;

  const isFormatDate = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  const { watchedAt } = talk;
  if (!watchedAt) {
    return res
      .status(400)
      .json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!isFormatDate.test(watchedAt)) {
    return res
      .status(400)
      .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

module.exports = {
  validateTalkerName,
  validateTalkerAge,
  validateTalkInfo,
  validateTalkDate,
  validateTalkRate,
};
