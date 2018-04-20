MyGame.chat = (function(network) {
  'use strict';

  function sendMessage(message, lobby = false) {
    const username = localStorage.getItem('username');

    if (lobby) {
      network.emit(NetworkIds.LOBBY_MESSAGE_CREATE, { username, message });
    } else {
      network.emit(NetworkIds.CHAT_MESSAGE_CREATE, { username, message });
    }
  }

  function initializeLobby() {
    const sendButton = document.getElementById('lobby-send-message');
    const newMessage = document.getElementById('lobby-new-message');

    sendButton.addEventListener('click', function() {
      const message = document.getElementById('lobby-new-message');

      if (message.value === '') {
        return;
      }

      sendMessage(message.value, true);
      message.value = '';
    });

    newMessage.addEventListener('keypress', function(e) {
      if (e.which === 13) {
        sendButton.click();
        e.preventDefault();
      }
    });

    network.listen(NetworkIds.JOIN_LOBBY, renderPlayerList);
    network.listen(NetworkIds.JOIN_LOBBY_OTHER, addPlayer);
    network.listen(NetworkIds.DISCONNECT_LOBBY_OTHER, removePlayer);
    network.listen(NetworkIds.LOBBY_MESSAGE_NEW, renderLobbyMessage);

    network.emit(NetworkIds.JOIN_LOBBY);
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

    network.unlisten(NetworkIds.JOIN_LOBBY, renderPlayerList);
    network.unlisten(NetworkIds.JOIN_LOBBY_OTHER, addPlayer);
    network.unlisten(NetworkIds.DISCONNECT_LOBBY_OTHER, removePlayer);
    network.unlisten(NetworkIds.LOBBY_MESSAGE_NEW, renderLobbyMessage);

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
    console.log('remove', clientId);
    const playerList = document.getElementById('lobby-player-list');
    const player = document.getElementById(`playerlist-$${clientId}`);

    playerList.removeChild(player);
  }

  function renderPlayerList({ player, otherPlayers }) {
    const players = [player, ...otherPlayers];
    const playerList = document.getElementById('lobby-player-list');

    playerList.innerHTML = '';

    players.forEach(player => addPlayer(player));
  }

  function renderLobbyMessage(data) {
    return renderChatMessage(data, true);
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
    const event = document.createElement('i');

    message.className = 'message game-message';
    firstUser.className = 'red';
    firstUser.innerHTML = data.firstUser;
    event.innerHTML = data.event;

    text.appendChild(firstUser);
    text.appendChild(event);

    if (data.secondUser) {
      const secondUser = document.createElement('span');
      secondUser.className = 'red';
      secondUser.innerHTML = data.secondUser;
      text.appendChild(secondUser);
    }

    message.appendChild(text);
    messageList.appendChild(message);
  }

  return {
    initializeGame,
    initializeLobby,
    renderChatMessage,
    renderGameMessage,
  };
})(MyGame.network);
