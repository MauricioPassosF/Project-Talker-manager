const express = require('express');

const talkerSearchRoutes = express.Router();

const { validateAuth } = require('../middlewares/checkAuth');
const { validateSearchRate, validateSearchDate } = require('../middlewares/checkTalkerSearch');
const { readFileFunc, talkerJsonPath } = require('../utils/functions');

talkerSearchRoutes.get(
  '/',
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
  },
);

module.exports = talkerSearchRoutes;
