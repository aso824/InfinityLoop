/* Game configuration */
var mapConfig = {
   width: 8,
   height: 10
};

/* Main game variables */
var currentLevel = 1;
var levelObj = {};
var rotateState = [];

/* SVG images */
var tilesObj = {
   readyState:    0,
   endpoint:      new Image(),
   curve:         new Image(),
   way3:          new Image(),
   way4:          new Image(),
   straight:      new Image()
};

/* Graphic (canvas) variables and objects */
var c;
var ctx;
var marginTop  = 0;
var marginLeft = 0;

/* Run game */
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
   // Wait for all tiles to load
   if (tilesObj.readyState != 5)
      return;

   // Load level
   getLevel(currentLevel);

   // Draw first frame
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
         width: 3,
         height: 3
      }
   }

   // Random tiles rotation
   rotateState = [];
   for (var i = 0; i < level.dimensions.height; i++) {
      rotateState[i] = [];
      for (var j = 0; j < level.dimensions.width; j++) {
         // Get random rotation from 0 to 3
         rotateState[i][j] = Math.floor(Math.random() * 4);
      }
   }

   // Save result
   levelObj = level;
}

/*
   Function for drawing current level
   Should be called after document.ready
*/
function drawCurrentLevel() {
   // Get canvas dimensions
   var cW = c.width;
   var cH = c.height;

   // Calculate tile size
   var tileW = parseInt(cW / mapConfig.width);
   var tileH = parseInt(cH / mapConfig.height);

   // Clear context
   ctx.clearRect(0, 0, cW, cH);

   // Internal margins/paddings to center all tiles
   marginTop  = parseInt((mapConfig.height - levelObj.dimensions.width) / 2) * parseInt(tileH * 1.25);
   marginLeft = parseInt((mapConfig.width - levelObj.dimensions.height) / 2) * parseInt(tileW * 1.5);

   // Draw level
   var objToDraw;
   for (var i = 0; i < levelObj.dimensions.height; i++) {
      for (var j = 0; j < levelObj.dimensions.width; j++) {
         // Skip empty fields
         if (levelObj.data[i][j] == 0)
            continue;

         // Prepare object to draw
         switch (levelObj.data[i][j]) {
            case 1: objToDraw = tilesObj.endpoint; break;
            case 2: objToDraw = tilesObj.curve; break;
            case 3: objToDraw = tilesObj.way3; break;
            case 4: objToDraw = tilesObj.way4; break;
            case 5: objToDraw = tilesObj.straight; break;
            default: break;
         }

         // Rotate, 1.57.. radians is 90 degrees
         var angle = rotateState[i][j] * 1.57079633;

         // Save context
         ctx.save();

         // Move (translate) and rotate
         ctx.translate(marginLeft + j * tileW, marginTop + i * tileH);
         ctx.rotate(angle);

         // Draw image
         ctx.drawImage(objToDraw, - parseInt(tileW / 2), - parseInt(tileH / 2), tileW, tileH);

         // Restore previous context
         ctx.restore();
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
