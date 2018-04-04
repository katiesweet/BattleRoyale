MyGame.screens['credits'] = (function(menu) {
	'use strict';

	function initialize() {
    document.getElementById('id-credits-back').addEventListener(
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
