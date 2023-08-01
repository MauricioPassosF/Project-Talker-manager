const express = require('express');
const { validateAuth } = require('../middlewares/checkAuth');
const { validateTalkRate } = require('../middlewares/checkTalkerBody');
const {
  talkerJsonPath,
  readFileFunc,
  writeFileFunc,
  createNewData,
} = require('../utils/functions');

const talkerRateRoutes = express.Router();

talkerRateRoutes.patch('/:id', validateAuth, validateTalkRate, async ({ body, params }, res) => {
  const { id } = params;
  const data = await readFileFunc(talkerJsonPath);
  const talkerInfo = data.find((talker) => talker.id === Number(id));
  if (!talkerInfo) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  const newTalkerInfo = { ...talkerInfo, talk: { ...talkerInfo.talk, ...body } };
  await writeFileFunc(talkerJsonPath, createNewData(id, data, newTalkerInfo));
  res.status(204).end();
});

module.exports = talkerRateRoutes;
