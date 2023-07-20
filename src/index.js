const express = require('express');
const fs = require('fs').promises;

const talkerJsonPath = './src/talker.json';

const readFileFunc = async (path) => {
  try {
    const data = await fs.readFile(path, 'utf-8');
    // console.log(data);
    return data;
  } catch (err) {
    console.error(`Erro ao ler o arquivo: ${err.message}`);
  }
};

// readFileFunc(talkerJsonPath);

const app = express();

app.use(express.json());

app.get('/talker', async (req, res) => {
  const data = await readFileFunc(talkerJsonPath);
  res.status(200).send(JSON.parse(data));
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
