MyGame.chat = (function(network) {
  'use strict';

  function sendMessage(message) {
    const username = localStorage.getItem('username');
    network.emit(NetworkIds.CHAT_MESSAGE_CREATE, { username, message });
  }

  function initializeLobby() {
    network.connect();

    const sendButton = document.getElementById('lobby-send-message');
    const newMessage = document.getElementById('lobby-new-message');

    sendButton.addEventListener('click', function() {
      const message = document.getElementById('lobby-new-message');

      if (message.value === '') {
        return;
      }

      sendMessage(message.value);
      message.value = '';
    });

    newMessage.addEventListener('keypress', function(e) {
      if (e.which === 13) {
        sendButton.click();
        e.preventDefault();
      }
    });

    network.listen(NetworkIds.CONNECT_ACK, ({ player, otherPlayers }) => {
      renderPlayerList([player, ...otherPlayers]);
    });

    network.listen(NetworkIds.CONNECT_OTHER, player => {
      addPlayer(player);
    });

    network.listen(NetworkIds.DISCONNECT_OTHER, player => {
      removePlayer(player);
    });

    network.listen(NetworkIds.CHAT_MESSAGE_NEW, data => {
      renderChatMessage(data, true);
    });

    network.listen(NetworkIds.GAME_MESSAGE_NEW, data => {
      renderGameMessage(data, true);
    });
  }

  function initializeGame() {
    const sendButton = document.getElementById('game-send-message');
    const newMessage = document.getElementById('game-new-message');

    sendButton.addEventListener('click', function() {
      const message = document.getElementById('game-new-message');

      if (message.value === '') {
        return;
      }

      sendMessage(message.value);
      message.value = '';
    });

    newMessage.addEventListener('keypress', function(e) {
      if (e.which === 13) {
        sendButton.click();
        e.preventDefault();
      }
    });

    network.listen(NetworkIds.CHAT_MESSAGE_NEW, renderChatMessage);
    network.listen(NetworkIds.GAME_MESSAGE_NEW, renderGameMessage);
  }

  function addPlayer({ clientId, username }) {
    const playerList = document.getElementById('lobby-player-list');
    const player = document.createElement('div');

    player.className = 'player';
    player.id = `playerlist-$${clientId}`;
    player.innerHTML = username;

    playerList.appendChild(player);
  }

  function removePlayer({ clientId }) {
    const playerList = document.getElementById('lobby-player-list');
    const player = document.getElementById(`playerlist-$${clientId}`);

    playerList.removeChild(player);
  }

  function renderPlayerList(players) {
    const playerList = document.getElementById('lobby-player-list');

    playerList.innerHTML = '';

    players.forEach(player => addPlayer(player));
  }

  function renderChatMessage(data, lobby = false) {
    const messageList = document.getElementById(
      lobby ? 'lobby-message-list' : 'game-message-list'
    );
    const message = document.createElement('div');
    const username = document.createElement('div');
    const text = document.createElement('p');

    message.className = 'message chat-message';
    username.className = 'username';
    username.innerHTML = data.username;
    text.innerHTML = data.message;

    message.appendChild(username);
    message.appendChild(text);
    messageList.appendChild(message);
  }

  function renderGameMessage(data, lobby = false) {
    const messageList = document.getElementById(
      lobby ? 'lobby-message-list' : 'game-message-list'
    );
    const message = document.createElement('div');
    const text = document.createElement('p');
    const firstUser = document.createElement('span');
    const secondUser = document.createElement('span');
    const event = document.createElement('i');

    message.className = 'message game-message';
    firstUser.className = secondUser.className = 'red';
    firstUser.innerHTML = data.firstUser;
    secondUser.innterHTML = data.secondUser;
    event.innerHTML = data.event;

    text.appendChild(firstUser);
    text.appendChild(event);
    text.appendChild(secondUser);
    message.appendChild(text);
    messageList.appendChild(message);
  }

  return {
    sendMessage,
    initializeGame,
    initializeLobby,
    renderChatMessage,
    renderGameMessage,
  };
})(MyGame.network);
