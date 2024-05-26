'use strict';

// Add event on multiple elements
const addEventOnElements = function (elements, eventType, callback) {
    for (const elem of elements) elem.addEventListener(eventType, callback);
}

// Toggle search box in mobile device || small screen
const searchBox = document.querySelector("[search_box]");
const searchTogglers = document.querySelectorAll("[search_toggler]");

addEventOnElements(searchTogglers, "click", function () {
    searchBox.classList.toggle("active");
});

/**
 * Store movieId in `localStorage` when you click any movie card.
 */
window.getMovieDetail = function (movieId) {
    window.localStorage.setItem("movieId", String(movieId));
    window.location.href = 'detail.html';
}

const getMovieList = function(urlParam, genreName) {
    window.localStorage.setItem("urlParam", urlParam);
    window.localStorage.setItem("genreName", genreName);
}