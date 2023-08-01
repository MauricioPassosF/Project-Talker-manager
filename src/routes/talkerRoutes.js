const express = require('express');
const { validateAuth } = require('../middlewares/checkAuth');
const {
  validateTalkerName,
  validateTalkerAge,
  validateTalkInfo,
  validateTalkRate,
  validateTalkDate,
} = require('../middlewares/checkTalkerBody');
const {
  talkerJsonPath,
  readFileFunc,
  writeFileFunc,
  createNewData,
} = require('../utils/functions');

const talkerRoutes = express.Router();

talkerRoutes.post(
  '/',
  validateAuth,
  validateTalkerName,
  validateTalkerAge,
  validateTalkInfo,
  validateTalkRate,
  validateTalkDate,
  async ({ body }, res) => {
    const data = await readFileFunc(talkerJsonPath);
    const nextID = data.length + 1;
    const newTalker = { ...body, id: nextID };
    data.push(newTalker);
    await writeFileFunc(talkerJsonPath, JSON.stringify(data));
    res.status(201).send(newTalker);
  },
);

talkerRoutes.get('/', async (req, res) => {
  const data = await readFileFunc(talkerJsonPath);
  res.status(200).send(data);
});

talkerRoutes.get('/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readFileFunc(talkerJsonPath);
  const talkerInfo = data.find((talker) => talker.id === Number(id));

  if (!talkerInfo) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  res.status(200).send(talkerInfo);
});

talkerRoutes.delete('/:id', validateAuth, async (req, res) => {
  const { id } = req.params;
  const data = await readFileFunc(talkerJsonPath);

  const newData = data.filter((talker) => talker.id !== Number(id));
  await writeFileFunc(talkerJsonPath, JSON.stringify(newData));
  res.status(204).end();
});

talkerRoutes.put(
  '/:id',
  validateTalkerName,
  validateTalkerAge,
  validateTalkInfo,
  validateTalkRate,
  validateTalkDate,
  validateAuth,
  async ({ body, params }, res) => {
    const { id } = params;
    const data = await readFileFunc(talkerJsonPath);
    const talkerInfo = data.find((talker) => talker.id === Number(id));
    if (!talkerInfo) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    const newTalkerInfo = { ...body, id: talkerInfo.id };
    await writeFileFunc(talkerJsonPath, createNewData(id, data, newTalkerInfo));
    res.status(200).send(newTalkerInfo);
  },
);

module.exports = talkerRoutes;
