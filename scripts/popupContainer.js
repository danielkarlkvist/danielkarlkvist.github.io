$(document).ready(function() {
    $(".scroll-snap-container").scroll(function() {
        var bottomOfSnakeSection = $("#snake-section").position().top + $("#snake-section").outerHeight() - 5;
        var bottomOfWindow = $(window).scrollTop() + $(window).height();

        if (bottomOfWindow > bottomOfSnakeSection) {
            var snakePopupContainer = document.getElementById("snake-popup-container");
            snakePopupContainer.style.visibility = "visible";
            snakePopupContainer.style.opacity = "1";
        }
    });
});