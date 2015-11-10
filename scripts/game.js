// Main game variables
var currentLevel = 1;

// HTML objects
$(document).ready(function() {
   // Get canvas
   var c = $('#mainCanvas')[0];
   var ctx = c.getContext('2d');

   drawCurrentLevel();
})

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
      dimensions: [3, 3]
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
}
