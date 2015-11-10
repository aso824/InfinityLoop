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
   // Calculate canvas dimensions to keep aspect ratio
   var w = parseInt($('main').height() / 5 * 4);
   var h = $('main').height();

   $('#mainCanvas').css('width', w);
   $('#mainCanvas').css('height', h);

   var ctx = $('#mainCanvas')[0].getContext('2d');
   ctx.canvas.width = w;
   ctx.canvas.height = h;
}

// All bindings when document ready
$(document).ready(function() {
   // Set canvas dimensions at startup
   resizeCanvas();

   // Auto resize canvas to keep aspect ratio
   $(window).resize(function() {
      resizeCanvas();
      drawCurrentLevel($('#mainCanvas')[0], $('#mainCanvas')[0].getContext('2d'));
   });
})
