const fs = require('fs').promises;

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

const getRandomCrypto = () => {
  let crypto = '';
  do {
    crypto = Math.random().toString(16).substr(2) + Math.random().toString(16).substr(2, 3);
  } while (crypto.length !== 16);
  return crypto;
};

const createNewData = (id, data, newTalkerInfo) => {
  const newData = data.map((talker) => {
    if (talker.id === Number(id)) {
      return newTalkerInfo;
    }
    return talker;
  });
  return JSON.stringify(newData);
};

const talkerJsonPath = './src/talker.json';

module.exports = {
  createNewData,
  getRandomCrypto,
  writeFileFunc,
  readFileFunc,
  talkerJsonPath,
};
