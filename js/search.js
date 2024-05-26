'use strict';

import { api_key, axiosDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";

export function search() {
    const searchWrapper = document.querySelector("[search_wrapper]");
    const searchField = document.querySelector("[search_field]");

    const searchResultModal = document.createElement("div");
    searchResultModal.classList.add("search_modal");
    document.querySelector("main").appendChild(searchResultModal);

    let searchTimeout;

    searchField.addEventListener("input", function() {
        if (!searchField.value.trim()) {
            searchResultModal.classList.remove("active");
            searchWrapper.classList.remove("searching");
            clearTimeout(searchTimeout);
            return;
        }

        searchWrapper.classList.add("searching");
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(async function() {
            await axiosDataFromServer(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${searchField.value}&page=1&include_adult=false`, function ({ results: movieList }) {
                searchWrapper.classList.remove("searching");
                searchResultModal.classList.add("active");
                searchResultModal.innerHTML = ""; //remove old result

                searchResultModal.innerHTML = `
                    <p class="label">Resultados para</p>
                    <h1 class="heading">${searchField.value}</h1>
                    <article class="movie_list">
                        <article class="grid_list"></article>
                    </article>
                `;

                for (const movie of movieList) {
                    const movieCard = createMovieCard(movie);
                    searchResultModal.querySelector(".grid_list").appendChild(movieCard);
                }
            });
        }, 500);
    });
}