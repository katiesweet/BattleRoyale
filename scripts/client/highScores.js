MyGame.screens['high-scores'] = (function(menu) {
	'use strict';

	function initialize() {
		document.getElementById('id-high-scores-back').addEventListener(
			'click',
			function() { menu.showScreen('main-menu'); });
	}

	function run() {

	}

	return {
		initialize : initialize,
		run : run
	};
}(MyGame.menu));
