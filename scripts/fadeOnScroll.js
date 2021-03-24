/* $(function() { // $(document).ready shorthand
    $('.monster').fadeIn('slow');
}); */

$(document).ready(function() {

    /* Every time the window is scrolled ... */
    $(".scroll-snap-container").scroll(function() {

        /* Check the location of each desired element */
        $('.fade-on-scroll-element').each(function() {

            var bottom_of_object = $(this).position().top + $(this).outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();

            /* If the object is completely visible in the window, fade it in */
            if (bottom_of_window > bottom_of_object) {

                $(this).animate({ 'opacity': '1' }, 500);

            }

        });

    });

});