MyGame.screens['keyboard-config'] = (function(menu, input) {
	'use strict';

	function initialize() {
		document.getElementById('id-keyboard-back').addEventListener(
			'click',
			function() { menu.showScreen('main-menu'); });
	}

	function run() {

	}

	return {
		initialize : initialize,
		run : run
	};
}(MyGame.menu, MyGame.input));
