const express = require('express');
const z = require('zod');
const fs = require('fs').promises;
const { validateAuth } = require('./middlewares/checkAuth');
const { validateTalkerName, validateTalkerAge,
  validateTalkDate, validateTalkInfo, validateTalkRate } = require('./middlewares/checkTalkerBody');
const { validateSearchRate, validateSearchDate } = require('./middlewares/checkTalkerSearch');
const { findAll } = require('./db/dbFunctions');

const app = express();

app.use(express.json());

const talkerJsonPath = './src/talker.json';

const validateEmail = ({ body }, res, next) => {
  const { email } = body;
  const emailSchema = z.string().email();
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!emailSchema.safeParse(email).success) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  next();
};

const validatePassword = ({ body }, res, next) => {
  const { password } = body;
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};

const readFileFunc = async (path) => {
  try {
    const data = await fs.readFile(path, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Erro ao ler o arquivo: ${err.message}`);
  }
};

const writeFileFunc = async (path, data) => {
  try {
    await fs.writeFile(path, data);
  } catch (err) {
    console.error(`Erro ao ler o arquivo: ${err.message}`);
  }
};

const getRandomCrypto = () => Math.random().toString(16).substr(2) 
+ Math.random().toString(16).substr(2, 3);

const createNewData = (id, data, newTalkerInfo) => {
  const newData = data.map((talker) => {
    if (talker.id === Number(id)) {
      return newTalkerInfo;
    }
    return talker;
  });
  return JSON.stringify(newData);
};

app.get('/talker/search',
  validateAuth,
  validateSearchRate,
  validateSearchDate,
  async ({ query }, res) => {
  const { q, rate, date } = query;
  const data = await readFileFunc(talkerJsonPath);
  let filteredData = data;
  if (rate) {
    filteredData = filteredData.filter(({ talk }) => talk.rate === Number(rate));
  }
  if (q) {
    filteredData = filteredData.filter(({ name }) => name.includes(q));
  }
  if (date) {
    filteredData = filteredData.filter(({ talk }) => talk.watchedAt === date);
  }
  res.status(200).send(filteredData);
});

app.patch('/talker/rate/:id', 
  validateAuth,
  validateTalkRate,
  async ({ body, params }, res) => {
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

app.get('/talker/db', async (_req, res) => {
  try {
    const [talkersDB] = await findAll();
    const data = talkersDB.map((talker) => ({
      age: talker.age,
      id: talker.id,
      name: talker.name,
      talk: {
        rate: talker.talk_rate,
        watchedAt: talker.talk_watched_at,
      },
    }));
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.sqlMessage });
  }
});

app.get('/talker', async (req, res) => {
  const data = await readFileFunc(talkerJsonPath);
  res.status(200).send(data);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readFileFunc(talkerJsonPath);
  const talkerInfo = data.find((talker) => talker.id === Number(id)); 

  if (!talkerInfo) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  res.status(200).send(talkerInfo);
});

app.delete('/talker/:id', validateAuth, async (req, res) => {
  const { id } = req.params;
  const data = await readFileFunc(talkerJsonPath);

  const newData = data.filter((talker) => talker.id !== Number(id));
  await writeFileFunc(talkerJsonPath, JSON.stringify(newData));
  res.status(204).end();
});

app.put('/talker/:id',
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
});

app.post('/talker',
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
});

app.post('/login',
 validateEmail,
 validatePassword, 
 (req, res) => {
  res.status(200).json({ token: getRandomCrypto() });
});

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, async () => {
  console.log('Online');
});
