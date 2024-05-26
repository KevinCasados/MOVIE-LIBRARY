'use strict';
import { imageBaseURL } from "./api.js";

/**
 * movie card
 */

export function createMovieCard(movie) {
    const {
        poster_path,
        title,
        vote_average,
        release_date,
        id
    } = movie;

    const card = document.createElement("div");
    card.classList.add("movie_card");

    card.innerHTML = `
        <a href="detail.html" class="card_btn" title="${title}" onclick="getMovieDetail(${id})">
            <figure class="poster_box card_banner">
                <img class="img_cover" src="${imageBaseURL}w342${poster_path}" alt="${title}" loading="lazy">
            </figure>

            <h4 class="title">${title}</h4>

            <div class="meta_list movie_meta_list">
                <div class="meta_item">
                    <img class="" src="img/star.png" width="20" height="20" loading="lazy" alt="rating">
                    <span class="span">${vote_average.toFixed(1)}</span>
                </div>

                <div class="card_badge">${release_date.split("-")[0]}</div>
            </div>
        </a>
    `;

    return card;
}