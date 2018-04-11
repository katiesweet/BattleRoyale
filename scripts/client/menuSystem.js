MyGame.menu = (function(screens) {
  'use strict';

  function showScreen(id) {
    let screen = 0;
    let active = document.getElementsByClassName('active');

    for (screen = 0; screen < active.length; screen++) {
      active[screen].classList.remove('active');
    }

    screens[id].run();
    document.getElementById(id).classList.add('active');
  }

  function checkLoggedInUser() {
    axios({
      method: 'get',
      url: 'http://localhost:3000/me',
      headers: { authorization: localStorage.getItem('token') || null },
    })
      .then(({ status, data }) => {
        if (data && data.username) {
          showScreen('main-menu');
        } else {
          showScreen('login');
        }
      })
      .catch(err => {
        console.log('Error fetching current user', err);
      });
  }

  function initialize() {
    let screen = null;
    for (screen in screens) {
      if (screens.hasOwnProperty(screen)) {
        screens[screen].initialize();
      }
    }

    checkLoggedInUser();
  }

  return {
    initialize: initialize,
    showScreen: showScreen,
  };
})(MyGame.screens);
