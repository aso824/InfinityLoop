function showCredits() {
   // Show gray overlay
   $('#gray_overlay').css('display', 'block');

   // Set colors correct for current body bg
   var boxBg   = '#CCC';
   var boxFont = '#333';
   var boxLink = '#444';
   if ($('body').css('background-color') != 'rgb(204, 204, 204)') { // RGB equivalent for #CCC
      boxBg    = '#333';
      boxFont  = '#999';
      boxLink  = '#CCC';
   }

   $('#credits_overlay').css('background-color', boxBg)
                        .css('color', boxFont);
   $('#credits_overlay a').css('color', boxLink);

   // Show credits box
   $('#credits_overlay').css('display', 'block');
}

function closeCredits() {
   // Hide gray overlay
   $('#gray_overlay').css('display', 'none');

   // Hide credits box
   $('#credits_overlay').css('display', 'none');
}

function resizeCanvas() {
   // Set canvas dimensions to keep aspect ratio
   $('#mainCanvas').css('width', $('main').height() / 5 * 4);
   $('#mainCanvas').css('height', $('main').height());
}

// All bindings when document ready
$(document).ready(function() {
   // Set canvas dimensions at startup
   resizeCanvas();

   // Auto resize canvas to keep aspect ratio
   $(window).resize(function() {
      resizeCanvas();
   });
})
