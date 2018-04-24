## Battle Royale

**Designed and developed by Adam King, Katie Sweet, and Sarah Isaac**

### How to run the server

npm install
npm start

### Feature locations

client prediction: scripts/client/game.js -> myGame.registerEvent
server reconciliation: scripts/client/game.js -> updateMessageHistory
entity interpolation: scripts/client/components/player-remote.js -> that.update and that.updateGoal
