/* Game configuration */
var mapConfig = {
   width: 8,
   height: 10
};

/* Main game variables */
var currentLevel = 1;

/* SVG images */
var tilesObj = {
   readyState:    0,
   endpoint:      new Image(),
   curve:         new Image(),
   way3:          new Image(),
   way4:          new Image(),
   straight:      new Image()
};

/* HTML objects */
var c;
var ctx;

// Run when ready
$(document).ready(function() {
   // Get canvas
   c = $('#mainCanvas')[0];
   ctx = c.getContext('2d');

   // Load SVG tiles - this will call startGame() when ready
   loadTiles();
})

/*
   Game start point
*/

function startGame() {
   if (tilesObj.readyState != 5)
      return;

   drawCurrentLevel();

   console.log('Resources loaded, game started.');
}

/*
   Function for getting requested level
   In future, this will return map from cache
*/

function getLevel(levelNum) {
   // Temporary lock
   if (levelNum != 1)
      return;

   // Object to return
   var level = {
      /*
         0 - empty space
         1 - end point
         2 - curve
         3 - 3-way connector
         4 - 4-way connector
         5 - straight line
      */
      data: [
               [1, 2, 0],
               [0, 5, 0],
               [0, 2, 1]
            ],
      dimensions: {
         x: 3,
         y: 3
      }
   }

   // Return result
   return level;
}

/*
   Function for drawing current level
   Should be called after document.ready
*/
function drawCurrentLevel() {
   // Get current level to draw
   var level = getLevel(currentLevel);

   // Get canvas dimensions
   var cW = c.width;
   var cH = c.height;

   // Calculate tile size
   var tileW = parseInt(cW / mapConfig.width);
   var tileH = parseInt(cH / mapConfig.height);

   // Clear context
   ctx.clearRect(0, 0, cW, cH);

   // Draw level
   var objToDraw;
   for (var i = 0; i < level.dimensions.y; i++) {
      for (var j = 0; j < level.dimensions.x; j++) {
         // Skip empty fields
         if (level.data[i][j] == 0)
            continue;

         // Prepare object to draw
         switch (level.data[i][j]) {
            case 1: objToDraw = tilesObj.endpoint; break;
            case 2: objToDraw = tilesObj.curve; break;
            case 3: objToDraw = tilesObj.way3; break;
            case 4: objToDraw = tilesObj.way4; break;
            case 5: objToDraw = tilesObj.straight; break;
            default: break;
         }

         // Scale

         // Draw
         ctx.drawImage(objToDraw, j * tileW, i * tileH, tileW, tileH);
      }
   }
}

/* Loading SVG images into tiles object */
function loadTiles() {
   // Debug info
   console.log('Started loading tiles...');

   // Set paths
   tilesObj.endpoint.src   = 'images/endpoint.svg';
   tilesObj.curve.src      = 'images/curve.svg';
   tilesObj.way3.src       = 'images/way3.svg';
   tilesObj.way4.src       = 'images/way4.svg';
   tilesObj.straight.src   = 'images/straight.svg';

   // Iterate over tiles object
   for (var i = 1; i <= 5; i++) {
      // Set onLoad function
      $(this).load(function() {
         // Increment counter
         tilesObj.readyState++;

         // Call entry point
         startGame();
      });
   };
}
