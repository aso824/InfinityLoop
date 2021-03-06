/* Game configuration */
var mapConfig = {
   width: 8,
   height: 10
};

/* Main game variables */
var currentLevel = 0;
var allLevels = [];
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
var tileW;
var tileH;
var marginTop  = 0;
var marginLeft = 0;

/* Run game */
$(document).ready(function() {
   // Get canvas
   c = $('#mainCanvas')[0];
   ctx = c.getContext('2d');

   // Load SVG tiles - this will call startGame() when ready
   loadTiles();

   // Bind mouse
   $('#mainCanvas').click(function (e) {
      // Mouse coordinates
      var mouseX = parseInt(e.pageX - $(this).offset().left);
      var mouseY = parseInt(e.pageY - $(this).offset().top);

      // Restrict click on tiles area
      if (mouseX < marginLeft - (tileW / 2))
         return;
      if (mouseX > marginLeft + (tileW) * (levelObj.dimensions.width - 1) + (tileW / 2))
         return;

      if (mouseY < marginTop - (tileH / 2))
         return;
      if (mouseY > marginTop + (tileH) * (levelObj.dimensions.height - 1) + (tileH / 2))
         return;

      // Calculating clicked tile
      var tileX = parseInt( (mouseX - marginLeft + (tileW / 2)) / tileW);
      var tileY = parseInt( (mouseY - marginTop + (tileH / 2)) / tileH);

      // Call function
      rotateTile(tileX, tileY);
   });
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

   console.log('Resources loaded, game started.');
}

/*
   This function is called when level is downloaded
*/

function levelReady() {
   // Draw level
   drawCurrentLevel();
}

/*
   Function for getting requested level
*/

function getLevel(levelNum) {
   // Check if level is in cache
   if (typeof allLevels[levelNum] !== "undefined") {
      levelObj = allLevels[levelNum];
      randomizeRotation();
      levelReady();
   } else {   // If not, get suitable file with levels
      // Calculate filename
      var fNumber = parseInt(levelNum / 10) * 10;
      var fName = "levels/" + fNumber + ".txt";

      // Get file
      $.getJSON(fName).done(function(data) {
         // Save levels into cache
         $(data.levels).each(function(index, value) {
            allLevels[fNumber] = value;
            fNumber++;
         });

         // Make sure that level is available
         if (typeof allLevels[levelNum] == "undefined") {
            console.error("Level " + levelNum + " is unavailable");
            alert("Level " + levelNum + " is unavailable");
            return;
         }

         // Level object
         levelObj = allLevels[levelNum];

         // Random tiles rotation
         randomizeRotation();

         // Call appropriate function
         levelReady();

      }).fail(function(d, textStatus, error) {
         console.error("Failed to download levels from " + fName + ", error: " + error);
      })
   }
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
   tileW = parseInt(cW / mapConfig.width);
   tileH = parseInt(cH / mapConfig.height);

   // Clear context
   ctx.clearRect(0, 0, cW, cH);

   // Internal margins/paddings to center all tiles
   marginTop  = parseInt((mapConfig.height - levelObj.dimensions.height) / 2) * parseInt(tileH * 1.25);
   marginLeft = parseInt((mapConfig.width - levelObj.dimensions.width) / 2) * parseInt(tileW * 1.5);

   // Draw level
   var objToDraw;
   for (var i = 0; i < levelObj.dimensions.height; i++) {
      for (var j = 0; j < levelObj.dimensions.width; j++) {
         // Skip empty fields
         if (levelObj.data[i][j] == 0)
            continue;

         // Rotate, 1.57.. radians is 90 degrees
         var angle = rotateState[i][j] * Math.PI/2;

         // Draw tile
         drawTile(j, i, angle);
      }
   }
}

/*
   Randomize tiles rotation
*/

function randomizeRotation() {
   // Clear array
   rotateState = [];

   // Iterate
   for (var i = 0; i < levelObj.dimensions.height; i++) {
      rotateState[i] = [];
      for (var j = 0; j < levelObj.dimensions.width; j++) {
         // Get random rotation from 0 to 3
         rotateState[i][j] = Math.floor(Math.random() * 4);
      }
   }
}

/*
   Restarts level
   Randomize all tiles and redraw
*/

function restartLevel() {
   // Randomize tiles rotation
   randomizeRotation();

   // Redraw
   drawCurrentLevel();
}

/*
   Rotating tiles on click
   @x, @y - position in array, not mouse position
*/
function rotateTile(x, y) {
   // Check tile
   if (levelObj.data[y][x] == 0)
      return;
   var angle = rotateState[y][x] * Math.PI/2;

   // Rotate by 90 degree, 1.57... is in radians
   rotateState[y][x] += 1;

   var angleEnd = rotateState[y][x] * Math.PI/2;

   // Area to clear
   var area = {
      x: marginLeft + (x * tileW) - (tileW / 2),
      y: marginTop + (y * tileH) - (tileH / 2)
   };

   // Animation
   $({ angle: angle}).animate({angle: angleEnd}, {
      duration: 250,
      step: function(now, fx) {
         // Clear area
         ctx.clearRect(area.x, area.y, tileW, tileH);

         // Draw tile
         drawTile(x, y, now);
      },
      complete: function() {
         // Call checkLevel() after every rotation
         var checkState = checkLevel();
         if (checkState == true) {
            currentLevel++;
            getLevel(currentLevel);
         }
      }
   });

   // Protect rotateState to have less than 4
   if (rotateState[y][x] > 3)
      rotateState[y][x] = 0;
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

/*
   Draw rotated tile on context
*/

function drawTile(posX, posY, angle) {
   // Prepare object to draw
   switch (levelObj.data[posY][posX]) {
      case 1: objToDraw = tilesObj.endpoint; break;
      case 2: objToDraw = tilesObj.curve; break;
      case 3: objToDraw = tilesObj.way3; break;
      case 4: objToDraw = tilesObj.way4; break;
      case 5: objToDraw = tilesObj.straight; break;
      default: break;
   }

   // Save context
   ctx.save();

   // Move (translate) and rotate
   ctx.translate(marginLeft + posX * tileW, marginTop + posY * tileH);
   ctx.rotate(angle);

   // Draw image
   ctx.drawImage(objToDraw, - parseInt(tileW / 2), - parseInt(tileH / 2), tileW, tileH);

   // Restore previous context
   ctx.restore();
}

/*
   Function tells which sides are connections of given tile
*/

function getConnSides(x, y) {
   var tileType = levelObj.data[y][x];
   var rotation = rotateState[y][x];
   var reply = [false, false, false, false];

   // Empty space
   if (tileType == 0)
      return reply;

   // End point
   if (tileType == 1) {
      reply[rotation] = true;
      return reply;
   }

   // Curve
   if (tileType == 2) {
      switch (rotation) {
         case 0: reply = [true, true, false, false]; break;
         case 1: reply = [false, true, true, false]; break;
         case 2: reply = [false, false, true, true]; break;
         case 3: reply = [true, false, false, true]; break;
      }

      return reply;
   }

   // 3-way connector
   if (tileType == 3) {
      switch (rotation) {
         case 0: reply = [true, true, true, false]; break;
         case 1: reply = [false, true, true, true]; break;
         case 2: reply = [true, false, true, true]; break;
         case 3: reply = [true, true, false, true]; break;
      }

      return reply;
   }

   // 4-way connector
   if (tileType == 4) {
      reply = [true, true, true, true];
      return reply;
   }

   // Straight line
   if (tileType == 5) {
      if (rotation == 0 || rotation == 2)
         reply = [true, false, true, false];
      else
         reply = [false, true, false, true];
      return reply;
   }
}

/*
   Checking current level
   @return bool - is level solved correctly
*/

function checkLevel() {
   // Generate array of all tiles connection sides
   var sides = [];
   for (var y = 0; y < levelObj.dimensions.height; y++) {
      sides[y] = [];
      for (var x = 0; x < levelObj.dimensions.width; x++) {
         sides[y][x] = getConnSides(x, y);
      }
   }

   // Validate all tiles
   for (var y = 0; y < levelObj.dimensions.height; y++) {
      for (var x = 0; x < levelObj.dimensions.width; x++) {
         // Special cases for tiles on border
         if (y == 0 && sides[y][x][0] == true)
            return false;
         if (y == levelObj.dimensions.height - 1 && sides[y][x][2] == true)
            return false;
         if (x == 0 && sides[y][x][3] == true)
            return false;
         if (x == levelObj.dimensions.width - 1 && sides[y][x][1] == true)
            return false;

         // Top
         if (y > 0 && sides[y][x][0] != sides[y - 1][x][2])
            return false;

         // Down
         if (y < levelObj.dimensions.height - 1 && sides[y][x][2] != sides[y + 1][x][0])
            return false;

         // Left
         if (x > 0 && sides[y][x][3] != sides[y][x - 1][1])
            return false;

         // Right
         if (x < levelObj.dimensions.width - 1 && sides[y][x][1] != sides[y][x + 1][3])
            return false;
      }
   }

   // If no error occured, level is complete
   console.log('checkLevel(): level ' + currentLevel + ' complete');
   return true;
}
