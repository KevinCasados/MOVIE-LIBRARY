'use strict';

import { api_key, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

// collect genre name & url parameter from local storage
const genreName = window.localStorage.getItem("genreName");
const urlParam = window.localStorage.getItem("urlParam");

const pageContent = document.querySelector("[page_content]");

sidebar();

let currentPage = 1;
let totalPages = 0;

const fetchURL = (page) => `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${page}&${urlParam}`;

fetchDataFromServer(fetchURL(currentPage), function ({ results: movieList, total_pages }) {
    totalPages = total_pages;
    document.title = `Películas ${genreName} - Kinova`;

    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie_list", "genre_list");
    movieListElem.ariaLabel = `${genreName} Películas`;

    movieListElem.innerHTML = `
        <article class="title_wrapper">
            <h1 class="heading">Todas las películas de ${genreName}</h1>
        </article>
        <article class="grid_list"></article>
        <button class="btn load_more" load-more>Cargar más</button>
    `;

    /**
     * add movie card based on fetched item
     */
    for (const movie of movieList) {
        const movieCard = createMovieCard(movie);
        movieListElem.querySelector(".grid_list").appendChild(movieCard);
    }

    pageContent.appendChild(movieListElem);

    /**
     * LOAD MORE BUTTON FUNCTIONALITY
     */
    document.querySelector("[load-more]").addEventListener("click", function () {
        if (currentPage >= totalPages) {
            this.style.display = "none"; // this == loading btn
            return;
        }

        currentPage++;
        this.classList.add("loading"); // this == loading btn

        fetchDataFromServer(fetchURL(currentPage), ({ results: movieList }) => {
            this.classList.remove("loading"); // this == loading btn

            for (const movie of movieList) {
                const movieCard = createMovieCard(movie);
                movieListElem.querySelector(".grid_list").appendChild(movieCard);
            }
        });
    });
});


search();