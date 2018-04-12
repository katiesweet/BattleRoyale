MyGame.chat = (function(network) {
  'use strict';

  function connect() {
    console.log('connect');
    const username = localStorage.getItem('username');
    network.emit(NetworkIds.CHAT_CONNECT, { username });
  }

  function disconnect() {
    const username = localStorage.getItem('username');
    network.emit(NetworkIds.CHAT_DISCONNECT, { username });
  }

  function sendMessage(message) {
    const username = localStorage.getItem('username');
    network.emit(NetworkIds.CHAT_MESSAGE_CREATE, { username, message });
  }

  function initializeLobby() {
    const sendButton = document.getElementById('lobby-send-message');

    sendButton.addEventListener('click', function() {
      const message = document.getElementById('lobby-new-message');
      sendMessage(message.value);
      message.value = '';
    });

    network.listen(NetworkIds.CHAT_CONNECT, data => {
      renderNewUser(data);
    });

    network.listen(NetworkIds.CHAT_DISCONNECT, data => {
      removeUser(data);
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

    sendButton.addEventListener('click', function() {
      const message = document.getElementById('game-new-message');
      sendMessage(message.value);
      message.value = '';
    });

    network.listen(NetworkIds.CHAT_MESSAGE_NEW, renderChatMessage);
    network.listen(NetworkIds.GAME_MESSAGE_NEW, renderGameMessage);
  }

  function renderNewUser(data) {
    const userList = document.getElementById('lobby-user-list');
    const user = document.createElement('div');

    user.className = 'user';
    user.id = `userlist-$${data.username}`;
    user.innerHTML = data.username;

    userList.appendChild(user);
  }

  function removeUser(data) {
    const userList = document.getElementById('lobby-user-list');
    const user = document.getElementById(`userlist-$${data.username}`);

    userList.removeChild(user);
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
    connect,
    disconnect,
    sendMessage,
    initializeGame,
    initializeLobby,
    renderChatMessage,
    renderGameMessage,
  };
})(MyGame.network);
