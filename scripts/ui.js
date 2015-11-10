function showCredits() {
   // Show gray overlay
   $('#gray_overlay').css('display', 'block');

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
