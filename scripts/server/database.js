const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

const SECRET_KEY = 'super secret key';

const adapter = new FileAsync('db.json');
let db;

async function initialize() {
  db = await low(adapter);

  if (!db) {
    throw new Error('Lowdb failed to initialize.');
  }

  const hashedPassword = await hashPassword('password');

  return db
    .defaults({
      users: [
        {
          username: 'Adam',
          highscore: 10000,
          hashedPassword,
        },
        {
          username: 'Adam again',
          highscore: 9999,
          hashedPassword,
        },
        {
          username: 'Katie',
          highscore: 1,
          hashedPassword,
        },
        {
          username: 'Sarah',
          highscore: 1,
          hashedPassword,
        },
      ],
    })
    .write();
}

async function getHighscores() {
  return db
    .get('users')
    .take(25)
    .map(user => ({ username: user.username, highscore: user.highscore }))
    .filter(user => user.highscore > 0)
    .orderBy(['highscore', 'username'], ['desc', 'asc'])
    .value();
}

async function updateHighscore(username, score) {
  let user = await getUser(username);

  if (Number(score) > user.highscore) {
    user = await updateUser(username, { highscore: Number(score) });
  }

  return user.highscore;
}

async function updateUser(username, updates) {
  return db
    .get('users')
    .find({ username })
    .assign(updates)
    .write();
}

async function getUserFromToken(token) {
  const { username } = jwt.verify(token, SECRET_KEY);
  return getUser(username);
}

async function getUser(username) {
  return db
    .get('users')
    .find({ username })
    .value();
}

function getTokenForUser(username) {
  return jwt.sign({ username }, SECRET_KEY);
}

async function loginUser(username, password) {
  const user = await db
    .get('users')
    .find({ username })
    .value();

  if (!user) {
    return { error: 'No user with that username exists!' };
  }

  const correctPassword = await isCorrectPassword(
    password,
    user.hashedPassword
  );

  if (!correctPassword) {
    return { error: 'Invalid username or password!' };
  }

  return { token: getTokenForUser(username) };
}

async function createUser(username, password) {
  const exists = await db
    .get('users')
    .find({ username })
    .value();

  if (exists) {
    return { error: 'That username is already taken!' };
  }

  const hashedPassword = await hashPassword(password);

  await db
    .get('users')
    .push({ username, hashedPassword, highscore: 0 })
    .write();

  return { token: getTokenForUser(username) };
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function isCorrectPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

module.exports = {
  initialize,
  getHighscores,
  updateHighscore,
  getUserFromToken,
  createUser,
  loginUser,
  updateUser,
};
