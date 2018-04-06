MyGame.screens['keyboard-config'] = (function(menu, input) {
	'use strict';

	var editing = false;

	function initialize() {
		document.getElementById('id-keyboard-back').addEventListener(
			'click',
			function() { menu.showScreen('main-menu'); });
      document.getElementById('fire-config').addEventListener('click', function() { edit('fire') });
      document.getElementById('rotate-left-config').addEventListener('click', function() { edit('rotate-left') });
      document.getElementById('rotate-right-config').addEventListener('click', function() { edit('rotate-right') });
      document.getElementById('move-up-config').addEventListener('click', function() { edit('move-up') });
      document.getElementById('move-down-config').addEventListener('click', function() { edit('move-down') });
      document.getElementById('move-right-config').addEventListener('click', function() { edit('move-right') });
      document.getElementById('move-left-config').addEventListener('click', function() { edit('move-left') });


	}

	function run() { }



  function edit(id) {
		editing = true;
    // open up "Edit tab" and populate the title of what is being edited like move-down command or something
  }

	return {
		initialize : initialize,
		run : run
	};
}(MyGame.menu, MyGame.input));
