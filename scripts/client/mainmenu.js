MyGame.screens['main-menu'] = (function(game) {
	'use strict';

	function initialize() {
		//
		// Setup each of menu events for the screens
		document.getElementById('id-new-game').addEventListener(
			'click',
			function() {game.showScreen('game-play'); });

		document.getElementById('id-high-scores').addEventListener(
			'click',
			function() { game.showScreen('high-scores'); });

		document.getElementById('id-help').addEventListener(
			'click',
			function() { game.showScreen('help'); });

		document.getElementById('id-about').addEventListener(
			'click',
			function() { game.showScreen('about'); });
	}

	function run() {
		//
		// I know this is empty, there isn't anything to do.
	}

	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game));
