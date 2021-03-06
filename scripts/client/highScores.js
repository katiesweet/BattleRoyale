MyGame.screens['highscores'] = (function(menu) {
  'use strict';

  function initialize() {}

  function run() {
    axios
      .get('/highscores')
      .then(({ status, data }) => {
        const highscores = data;
        const hsList = document.getElementById('hs-list');

        hsList.innerHTML = '';

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
