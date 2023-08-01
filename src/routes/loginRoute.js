const express = require('express');

const router = express.Router();

const { validateEmail, validatePassword } = require('../middlewares/checkLogin');

const { getRandomCrypto } = require('../utils/functions');

router.post('/', validateEmail, validatePassword, (req, res) => {
  res.status(200).json({ token: getRandomCrypto() });
});

module.exports = router;
