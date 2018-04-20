MyGame.screens['login'] = (function(menu) {
  'use strict';

  function login() {
    authenticate('/login');
  }

  function register() {
    authenticate('/register');
  }

  function authenticate(endpoint) {
    const username = document.getElementById('username-input').value;
    const password = document.getElementById('password-input').value;
    const notification = document.getElementById('error-notification');

    notification.innerHTML = '';
    notification.style.display = 'none';

    axios
      .post(endpoint, { username, password })
      .then(({ status, data }) => {
        localStorage.setItem('username', username);
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
