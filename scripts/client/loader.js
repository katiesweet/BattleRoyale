MyGame = {
  input: {},
  components: {},
  renderer: {},
  utilities: {},
  assets: {},
  screens: {},
  barrierJson: {},
};

//------------------------------------------------------------------
//
// Purpose of this code is to bootstrap (maybe I should use that as the name)
// the rest of the application.  Only this file is specified in the index.html
// file, then the code in this file gets all the other code and assets
// loaded.
//
//------------------------------------------------------------------
MyGame.loader = (function() {
  'use strict';
  let scriptOrder = [
      {
        scripts: ['../shared/network-ids'],
        message: 'Network Ids loaded',
        onComplete: null,
      },
      {
        scripts: ['../shared/queue'],
        message: 'Utilities loaded',
        onComplete: null,
      },
      {
        scripts: ['input'],
        message: 'Input loaded',
        onComplete: null,
      },
      {
        scripts: ['network'],
        message: 'Network loaded',
        onComplete: null,
      },
      {
        scripts: [
          'components/player',
          'components/player-remote',
          'components/bullet',
          'components/explosion',
          'components/animated-sprite',
          'components/cowboy-sprite',
          'components/tiled-image',
          'components/viewport',
          'components/barriers',
        ],
        message: 'Player models loaded',
        onComplete: null,
      },
      {
        scripts: ['menuSystem'],
        message: 'Menu system loaded',
        onComplete: null,
      },
      {
        scripts: ['chat'],
        message: 'Chat loaded',
        onComplete: null,
      },
      {
        scripts: [
          'mainmenu',
          'lobby',
          'pregame',
          'credits',
          'highScores',
          'login',
          'keyboard',
        ],
        message: 'All menus loaded',
        onComplete: null,
      },
      {
        scripts: ['rendering/graphics'],
        message: 'Graphics loaded',
        onComplete: null,
      },
      {
        scripts: [
          'rendering/player',
          'rendering/player-remote',
          'rendering/bullet',
          'rendering/animated-sprite',
          'rendering/tiled-image',
          'rendering/mini-map',
          'rendering/spawn-map',
          'rendering/powerups'
        ],
        message: 'Renderers loaded',
        onComplete: null,
      },
      {
        scripts: ['game'],
        message: 'Gameplay model loaded',
        onComplete: null,
      },
    ],
    assetOrder = [
      {
        key: 'desert-floor',
        source: 'assets/tiles/map_49.png',
      },
      {
        key: 'mini-map',
        source: 'assets/miniMap.png',
      },
      {
        key: 'player-self',
        source: 'assets/cowboy.png',
      },
      {
        key: 'player-other',
        source: 'assets/cowboy_red.png',
      },
      {
        key: 'skeleton',
        source: 'assets/skeleton.png',
      },
      {
        key: 'explosion',
        source: 'assets/explosion.png',
      },
      {
        key: 'kaboom', // for shooting a gun
        source: 'assets/rumble.mp3',
      },
      {
        key: 'gun-click',
        source: 'assets/click.mp3',
      },
      {
        key: 'boom', // for when someone is hit/explosions
        source: 'assets/DeathFlash.mp3',
      },
      {
        key: 'weapon-powerup',
        source: 'assets/gun1_powerup.png'
      },
      {
        key: 'bullet-powerup',
        source: 'assets/bullet_powerup.png'
      },
      {
        key: 'health-powerup',
        source: 'assets/beer_powerup.png'
      },
      {
        key: 'armour-powerup',
        source: 'assets/vest_powerup.png'
      }
    ];
  //------------------------------------------------------------------
  //
  // Helper function used to generate the asset entries necessary to
  // load a tiled image into memory.
  //
  //------------------------------------------------------------------
  function prepareTiledImage(
    assetArray,
    rootName,
    rootKey,
    sizeX,
    sizeY,
    tileSize
  ) {
    let numberX = sizeX / tileSize,
      numberY = sizeY / tileSize,
      tileFile = '',
      tileSource = '',
      tileKey = '',
      tileX = 0,
      tileY = 0;

    //
    // Create an entry in the assets that holds the properties of the tiled image
    MyGame.assets[rootKey] = {
      width: sizeX,
      height: sizeY,
      tileSize: tileSize,
    };

    for (tileY = 0; tileY < numberY; tileY += 1) {
      for (tileX = 0; tileX < numberX; tileX += 1) {
        tileFile = tileY * numberX + tileX;
        tileSource = rootName + tileFile + '.png';
        tileKey = rootKey + '-' + tileFile;
        assetArray.push({
          key: tileKey,
          source: tileSource,
        });
      }
    }
  }

  //------------------------------------------------------------------
  //
  // Helper function used to load scripts in the order specified by the
  // 'scripts' parameter.  'scripts' expects an array of objects with
  // the following format...
  //    {
  //        scripts: [script1, script2, ...],
  //        message: 'Console message displayed after loading is complete',
  //        onComplete: function to call when loading is complete, may be null
  //    }
  //
  //------------------------------------------------------------------
  function loadScripts(scripts, onComplete) {
    //
    // When we run out of things to load, that is when we call onComplete.
    if (scripts.length > 0) {
      let entry = scripts[0];
      require(entry.scripts, function() {
        console.log(entry.message);
        if (entry.onComplete) {
          entry.onComplete();
        }
        scripts.splice(0, 1);
        loadScripts(scripts, onComplete);
      });
    } else {
      onComplete();
    }
  }

  //------------------------------------------------------------------
  //
  // Helper function used to load assets in the order specified by the
  // 'assets' parameter.  'assets' expects an array of objects with
  // the following format...
  //    {
  //        key: 'asset-1',
  //        source: 'assets/url/asset.png'
  //    }
  //
  // onSuccess is invoked per asset as: onSuccess(key, asset)
  // onError is invoked per asset as: onError(error)
  // onComplete is invoked once per 'assets' array as: onComplete()
  //
  //------------------------------------------------------------------
  function loadAssets(assets, onSuccess, onError, onComplete) {
    //
    // When we run out of things to load, that is when we call onComplete.
    if (assets.length > 0) {
      let entry = assets[0];
      loadAsset(
        entry.source,
        function(asset) {
          onSuccess(entry, asset);
          assets.splice(0, 1);
          loadAssets(assets, onSuccess, onError, onComplete);
        },
        function(error) {
          onError(error);
          assets.splice(0, 1);
          loadAssets(assets, onSuccess, onError, onComplete);
        }
      );
    } else {
      onComplete();
    }
  }

  //------------------------------------------------------------------
  //
  // This function is used to asynchronously load image and audio assets.
  // On success the asset is provided through the onSuccess callback.
  // Reference: http://www.html5rocks.com/en/tutorials/file/xhr2/
  //
  //------------------------------------------------------------------
  function loadAsset(source, onSuccess, onError) {
    let xhr = new XMLHttpRequest(),
      asset = null,
      fileExtension = source.substr(source.lastIndexOf('.') + 1); // Source: http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript

    if (fileExtension) {
      xhr.open('GET', source, true);
      xhr.responseType = 'blob';

      xhr.onload = function() {
        if (xhr.status === 200) {
          if (fileExtension === 'png' || fileExtension === 'jpg') {
            asset = new Image();
          } else if (fileExtension === 'mp3') {
            asset = new Audio();
          } else {
            if (onError) {
              onError('Unknown file extension: ' + fileExtension);
            }
          }
          asset.onload = function() {
            window.URL.revokeObjectURL(asset.src);
          };
          asset.src = window.URL.createObjectURL(xhr.response);
          if (onSuccess) {
            onSuccess(asset);
          }
        } else {
          if (onError) {
            onError('Failed to retrieve: ' + source);
          }
        }
      };
    } else {
      if (onError) {
        onError('Unknown file extension: ' + fileExtension);
      }
    }

    xhr.send();
  }

  //------------------------------------------------------------------
  //
  // This function is used to asynchronously load map_object json file
  //
  //------------------------------------------------------------------
  function loadMapObjects(fileName, onSuccess) {
    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType('application/json');
    rawFile.onreadystatechange = function() {
      if (rawFile.readyState == 4 && rawFile.status == 200) {
        onSuccess(JSON.parse(rawFile.responseText));
      }
      // else {
      //   onError('Error opening file: ' + fileName);
      // }
    };
    rawFile.open('GET', fileName, true);
    rawFile.send(null);
  }

  //------------------------------------------------------------------
  //
  // Called when all the scripts are loaded, it kicks off the demo app.
  //
  //------------------------------------------------------------------
  function mainComplete() {
    const loading = document.getElementById('loading');

    loading.style.opacity = 0;

    setTimeout(() => {
      loading.style.display = 'none';
    }, 1000);

    console.log("We're all loaded up!");

    MyGame.menu.initialize();
  }

  //
  // Start with loading the assets, then the scripts.
  console.log('Starting to dynamically load project assets');

  prepareTiledImage(
    assetOrder,
    'assets/tiles/map_',
    'background',
    15360,
    15360,
    1024
  );

  loadMapObjects('assets/map_objects.json', function(barriers) {
    MyGame.barrierJson = barriers;
    console.log('Loaded barriers');
  });

  loadAssets(
    assetOrder,
    function(source, asset) {
      // Store it on success
      MyGame.assets[source.key] = asset;
    },
    function(error) {
      console.log(error);
    },
    function() {
      console.log('All assets loaded');
      console.log('Starting to dynamically load project scripts');
      loadScripts(scriptOrder, mainComplete);
      console.log('My assets:', MyGame.assets);
    }
  );
})();
