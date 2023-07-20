const express = require('express');

const fs = require('fs').promises;

const talkerJsonPath = './src/talker.json';

const readFileFunc = async (path) => {
  try {
    const data = await fs.readFile(path, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Erro ao ler o arquivo: ${err.message}`);
  }
};

// const getRandomCrypto = () => cryptoRandomString({ length: 16 });
const getRandomCrypto = () => Math.random().toString(16).substr(2) 
+ Math.random().toString(16).substr(2, 3);

const app = express();

app.use(express.json());

app.get('/talker', async (req, res) => {
  const data = await readFileFunc(talkerJsonPath);
  res.status(200).send(data);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await readFileFunc(talkerJsonPath);
  const person = talkers.filter((talker) => talker.id === Number(id)); 

  if (person.length === 0) {
    res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  res.status(200).send(person[0]);
});

app.post('/login', (req, res) => {
  res.status(200).json({ token: getRandomCrypto() });
});

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
