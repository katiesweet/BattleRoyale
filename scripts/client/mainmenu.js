MyGame.screens['main-menu'] = (function(menu) {
	'use strict';

	function initialize() {
		document.getElementById('id-new-game').addEventListener(
			'click',
			function() {menu.showScreen('gamePlay'); });

		document.getElementById('id-keyboard-config').addEventListener(
			'click',
			function() {menu.showScreen('keyboard-config'); });

		document.getElementById('id-high-scores').addEventListener(
			'click',
			function() { menu.showScreen('high-scores'); });

		document.getElementById('id-credits').addEventListener(
			'click',
			function() { menu.showScreen('credits'); });
	}

	function run() {

	}

	return {
		initialize : initialize,
		run : run
	};
}(MyGame.menu));
