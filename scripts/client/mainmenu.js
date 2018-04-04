MyGame.screens['main-menu'] = (function(menu) {
	'use strict';

	function initialize() {
		document.getElementById('id-new-game').addEventListener(
			'click',
			function() {menu.showScreen('gamePlay'); });

		document.getElementById('id-high-scores').addEventListener(
			'click',
			function() { menu.showScreen('high-scores'); });

		document.getElementById('id-help').addEventListener(
			'click',
			function() { menu.showScreen('help'); });

		document.getElementById('id-about').addEventListener(
			'click',
			function() { menu.showScreen('about'); });
	}

	function run() {

	}

	return {
		initialize : initialize,
		run : run
	};
}(MyGame.menu));
