$(window).on('load resize', function(){
    "use strict";
    var _array = [
        //      [height=0]
        //      [width=1]
        //      [height&width=3]
        //      [0:3]       [parent]                [child]
        /*00*/ 	"0",        ".carousel-inner",      ".item",
        /*01*/	"0",        ".solutions-section",   ".solution-text"
    ];
    for(var x = 0;_array.length > x;x+=3){
        $(_array[x+1].toString()).each(function()
        {
            var boxes = $(this).find(_array[x+2].toString());
            if(_array[x] === "0" || _array[x] === "3"){
                boxes.css("height", "");
                var maxHeight = Math.max.apply(Math, boxes.map(function() {return $(this).height();}).get());
                boxes.height(maxHeight);
            }
            if(_array[x] === "1" || _array[x] === "3"){
                boxes.css("width", "");
                var maxWidth = Math.max.apply(Math, boxes.map(function() {return $(this).width();}).get());
                boxes.height(maxWidth);
            }
        });
    }
});


$(document).ready(function () {
	// Get the current URL
	var currentLocation = window.location.href;

	// Loop through each link in the navbar
	$(".navbar-nav a").each(function () {
		var link = $(this).attr("href");

		// Check if the current URL matches the link
		if (currentLocation.indexOf(link) !== -1) {
			$(this).addClass("active");
		} else {
			$(this).removeClass("active");
		}
	});

	// Add active class on click
	$(".navbar-nav a").on("click", function () {
		$(".navbar-nav a").removeClass("active");
		$(this).addClass("active");
	});
});
