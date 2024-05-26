'use strict';

// IMPORT ALL COMPONENTS AND FUNCTIONS
import { sidebar } from "./sidebar.js";
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const pageContent = document.querySelector("[page_content]");

sidebar();

/**
 * Home page sections (top rated, upcoming, trending movies)
 */
const homePageSections = [
    {
        title: "Películas en tendencia",
        path: "/trending/movie/week"
    },
    {
        title: "Películas mejor calificadas",
        path: "/movie/top_rated"
    },
    {
        title: "Próximos Estrenos",
        path: "/movie/upcoming"
    }
];

/** 
 * fetch all genres eg: [ { "id": "123", "name": "Action" } ]
 * then change genre format eg: { 123: "Action" }
 */ 
const genreList = {
    // create genre string from genre_id eg: [23, 43] -> "Acción, Aventura".
    asString(genreIdList) {
        let newGenreList = [];
        for (const genreId of genreIdList) {
            this[genreId] && newGenreList.push(this[genreId]); // This == genreList;
        }
        return newGenreList.join(", ");
    }
};

fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function ({ genres }) { 
    for (const { id, name} of genres) {
        genreList[id] = name;
    }

    fetchDataFromServer(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`, heroBanner);
});

const heroBanner = function({ results: movieList }) {
    const banner = document.createElement("section");
    banner.classList.add("banner");
    banner.ariaLabel = "Películas Populares";

    banner.innerHTML = `
        <div class="banner_slider"></div>
        <div class="slider_control">
            <div class="control_inner"></div>
        </div>
    `;

    let controlItemIndex = 0;

    for (const [index, movie] of movieList.entries()) {
        const {
            backdrop_path,
            title,
            release_date,
            genre_ids,
            overview,
            poster_path,
            vote_average,
            id
        } = movie;

        const sliderItem = document.createElement("div");
        sliderItem.classList.add("slider_item");
        sliderItem.setAttribute("slider_item", "");

        sliderItem.innerHTML = `
            <img src="${imageBaseURL}w1280${backdrop_path}" class="img_cover" alt="${title}" loading="${index === 0 ? "eager" : "lazy"}">
            <div class="banner_content">
                <h2 class="heading">${title}</h2>
                <div class="meta_list banner_meta_list">
                    <div class="meta_item">${release_date.split("-")[0]}</div>
                    <div class="meta_item card_badge">${vote_average.toFixed(1)}</div>
                    <p class="genre">${genreList.asString(genre_ids)}</p>
                </div>
                <p class="banner_text">${overview}</p>
                <a href="detail.html" class="btn" onclick="getMovieDetail(${id})">
                    <img src="img/play_circle.png" width="24" height="24" aria-hidden="true" alt="play circle">
                    <span class="span">Ver Ahora</span>
                </a>
            </div>
        `;
        banner.querySelector(".banner_slider").appendChild(sliderItem);

        const controlItem = document.createElement("button");
        controlItem.classList.add("poster_box", "slider_item");
        controlItem.setAttribute("slider_control", `${controlItemIndex}`);

        controlItemIndex++;

        controlItem.innerHTML = `
            <img class="img_cover" src="${imageBaseURL}w154${poster_path}" alt="Slide a ${title}" loading="lazy" draggable="false">
        `;

        banner.querySelector(".control_inner").appendChild(controlItem);
    }

    pageContent.appendChild(banner);

    addHeroSlide();

    // Fetch data from home page sections (top rated, upcoming, trending)
    for (const { title, path } of homePageSections) {
        fetchDataFromServer(`https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1`, createMovieList, title);
    }
}

/**
 * Hero slider functionality
 */
const addHeroSlide = function() {
    const sliderItems = document.querySelectorAll("[slider_item]");
    const sliderControls = document.querySelectorAll("[slider_control]");

    let lastSliderItem = sliderItems[0];
    let lastSliderControl = sliderControls[0];

    lastSliderItem.classList.add("active");
    lastSliderControl.classList.add("active");

    const sliderStart = function() {
        lastSliderItem.classList.remove("active");
        lastSliderControl.classList.remove("active");

        sliderItems[Number(this.getAttribute("slider_control"))].classList.add("active");
        this.classList.add("active");

        lastSliderItem = sliderItems[Number(this.getAttribute("slider_control"))];
        lastSliderControl = this;
    }

    addEventOnElements(sliderControls, "click", sliderStart);
}

const createMovieList = function({ results: movieList }, title) {
    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie_list");
    movieListElem.ariaLabel = `${title}`;

    movieListElem.innerHTML = `
        <article class="title_wrapper">
            <h3 class="title_large">${title}</h3>
        </article>
        <article class="slider_list">
            <div class="slider_inner"></div>
        </article>
    `;

    for (const movie of movieList) {
        const movieCard = createMovieCard(movie); // Called from movie-card.js
        movieListElem.querySelector(".slider_inner").appendChild(movieCard);
    }

    pageContent.appendChild(movieListElem);
}

search();