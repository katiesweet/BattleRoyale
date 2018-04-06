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

  function run() {
    axios({
      method: 'get',
      url: 'http://localhost:3000/me',
      headers: { authorization: localStorage.getItem('token') || null },
    })
      .then(({ status, data }) => {
        if (data && data.username) {
          menu.showScreen('main-menu');
        }
      })
      .catch(err => {
        console.log('Error fetching current user', err);
      });
  }

  return {
    initialize: initialize,
    run: run,
  };
})(MyGame.menu);
