$(document).ready(function() {
    /* W4indow is scrolled */
    $(".scroll-snap-container").scroll(function() {
        /* Check the location of each desired element */
        $('.fade-on-scroll-element').each(function() {
            var bottomOfObject = $(this).position().top + $(this).outerHeight();
            var bottomOfWindow = $(window).scrollTop() + $(window).height();

            /* If the object is completely visible in the window, fade it in */
            if (bottomOfWindow > bottomOfObject) {
                $(this).animate({ 'opacity': '1' }, 500);
            }
        });
    });
});