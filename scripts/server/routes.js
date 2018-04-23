const Router = require('express').Router;

const db = require('./database');

const router = Router();

router.use(async (req, res, next) => {
  const token = req.headers.authorization;

  if (token && token !== '' && token !== 'null') {
    req.user = await db.getUserFromToken(token);
  }

  next();
});

router.get('/me', (req, res) => {
  res.status(200).send(req.user);
});

router.get('/highscores', async (req, res) => {
  const highscores = await db.getHighscores();
  res.status(200).send(highscores);
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const { error, token } = await db.loginUser(username, password);

  if (error) {
    res.status(403).send(error);
  }

  res.status(200).send(token);
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const { error, token } = await db.createUser(username, password);

  if (error) {
    res.status(409).send(error);
  }

  res.status(200).send(token);
});

module.exports = router;
