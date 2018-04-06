MyGame.screens['highscores'] = (function(menu) {
  'use strict';

  function initialize() {
    document
      .getElementById('id-highscores-back')
      .addEventListener('click', function() {
        menu.showScreen('main-menu');
      });
  }

  function run() {
    axios
      .get('http://localhost:3000/highscores')
      .then(({ status, data }) => {
        const highscores = data;
        const hsList = document.getElementById('hs-list');

        for (let i = 0; i < highscores.length; i++) {
          const listItem = document.createElement('li');
          const { username, highscore } = highscores[i];

          listItem.innerHTML = `${username}: ${highscore}`;

          hsList.appendChild(listItem);
        }
      })
      .catch(err => {
        console.log('Error fetching highscores', err);
      });
  }

  return {
    initialize: initialize,
    run: run,
  };
})(MyGame.menu);
