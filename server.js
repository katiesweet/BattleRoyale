const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const game = require('./scripts/server/game');
const routes = require('./scripts/server/routes');
const db = require('./scripts/server/database');

const app = express();
const server = http.createServer(app);

app.use('/', express.static(__dirname));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.use(bodyParser.json(), routes);

server.listen(3000, async function() {
  await db.initialize();

  game.initialize(server);
  console.log('Server is listening on port 3000');
});
