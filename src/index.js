const express = require('express');
const loginRoutes = require('./routes/loginRoute');
const { findAll } = require('./db/dbFunctions');
const talkerSearchRoutes = require('./routes/talkerSearchRoutes');
const talkerRateRoutes = require('./routes/talkerRateRoutes');
const talkerRoutes = require('./routes/talkerRoutes');

const app = express();

app.use(express.json());

app.use('/login', loginRoutes);

app.use('/talker/search', talkerSearchRoutes);

app.use('/talker/rate/', talkerRateRoutes);

app.use('/talker', talkerRoutes);

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

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, async () => {
  console.log('Online');
});
