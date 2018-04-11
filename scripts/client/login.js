MyGame.screens['login'] = (function(menu) {
  'use strict';

  function login() {
    const username = document.getElementById('username-input').value;
    const password = document.getElementById('password-input').value;
    const notification = document.getElementById('error-notification');

    notification.innerHTML = '';
    notification.style.display = 'none';

    axios
      .post('http://localhost:3000/login', { username, password })
      .then(({ status, data }) => {
        localStorage.setItem('token', data);
        menu.showScreen('main-menu');
      })
      .catch(({ response }) => {
        notification.innerHTML = response.data;
        notification.style.display = 'block';
      });
  }

  function register() {
    const username = document.getElementById('username-input').value;
    const password = document.getElementById('password-input').value;
    const notification = document.getElementById('error-notification');

    notification.innerHTML = '';
    notification.style.display = 'none';

    axios
      .post('http://localhost:3000/register', { username, password })
      .then(({ status, data }) => {
        localStorage.setItem('token', data);
        menu.showScreen('main-menu');
      })
      .catch(({ response }) => {
        notification.innerHTML = response.data;
        notification.style.display = 'block';
      });
  }

  function initialize() {
    document.getElementById('login-btn').addEventListener('click', login);
    document.getElementById('register-btn').addEventListener('click', register);
  }

  function run() {}

  return {
    initialize: initialize,
    run: run,
  };
})(MyGame.menu);
