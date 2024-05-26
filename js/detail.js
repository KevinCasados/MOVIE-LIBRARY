'use strict';

import { api_key, imageBaseURL, axiosDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page_content]");

sidebar();

const getGenres = function (genreList) {
    const newGenreList = [];
    for (const { name } of genreList) newGenreList.push(name);
    return newGenreList.join(", ");
}

const getCast = function (castList) {
    const newCastList = [];
    for (let i = 0, len = castList.length; i < len && i < 10; i++) {
        const { name } = castList[i];
        newCastList.push(name);
    }
    return newCastList.join(", ");
}

const getDirectors = function (crewList) {
    const directors = crewList.filter(({ job }) => job === "Director");
    const directorList = [];
    for (const { name } of directors) directorList.push(name);
    return directorList.join(", ");
}

// returns only trailers and teasers as array
const filterVideos = function (videoList) {
    return videoList.filter(({ type, site}) => (type === "Trailer" || type === "Teaser") && site === "YouTube");
}

const loadMovieDetails = async function(movieId) {
    try {
        const movie = await axiosDataFromServer(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=credits,videos,images,releases`);
        const {
            backdrop_path,
            poster_path,
            title,
            release_date,
            runtime,
            vote_average,
            releases: { countries: [{ certification }] },
            genres,
            overview,
            credits: { cast, crew },
            videos: { results: videos }
        } = movie;

        // Actualizar el título de la página
        document.title = `${title} - Kinova`;

        const movieDetail = document.createElement("div");
        movieDetail.classList.add("movie_detail");

        movieDetail.innerHTML = `
            <article class="backdrop_image" style="background-image: url('${imageBaseURL}w1280${backdrop_path || poster_path}')"></article>
            <figure class="poster_box movie_poster">
                <img class="img_cover" src="${imageBaseURL}w342${poster_path}" alt="${title} poster">
            </figure>
            <article class="detail_box">
                <div class="detail_content">
                    <h1 class="heading">${title}</h1>
                    <div class="meta_list">
                        <div class="meta_item">
                            <img class="meta_item_star" src="img/star.png" alt="rating">
                            <span class="span">${vote_average.toFixed(1)}</span>
                            <div class="separator"></div>
                            <div class="meta_item">${runtime}m</div>
                            <div class="separator"></div>
                            <div class="meta_item">${release_date.split("-")[0]}</div>
                            <div class="meta_item card_badge">${certification}</div>
                        </div>
                    </div>
                    <p class="genre">${getGenres(genres)}</p>
                    <p class="overview">${overview}</p>
                    <ul class="detail_list">
                        <div class="list_item">
                            <p class="list_name">Actores</p>
                            <p>${getCast(cast)}</p>
                        </div>
                        <div class="list_item">
                            <p class="list_name">Dirigida por</p>
                            <p>${getDirectors(crew)}</p>
                        </div>
                    </ul>
                </div>
                <div class="title_wrapper">
                    <h3 class="title_large">Tráilers y clips</h3>
                </div>
                <div class="slider_list">
                    <div class="slider_inner"></div>
                </div>
            </article>
        `;

        for (const { key, name } of filterVideos(videos)) {
            const videoCard = document.createElement("div");
            videoCard.classList.add("video_card");

            videoCard.innerHTML = `
                <iframe width="500" height="294" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0" frameborder="0" allowfullscreen="1" title="${name}" class="img_cover" loading="lazy"></iframe>
            `;

            movieDetail.querySelector(".slider_inner").appendChild(videoCard);
        }

        pageContent.appendChild(movieDetail);

        // Axios and display recommended movies
        axiosDataFromServer(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&page=1`, addSuggestedMovies);
    } catch (error) {
        console.error('Error loading movie details:', error);
    }
};

const addSuggestedMovies = function({ results: movieList }) {
    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie_list");
    movieListElem.ariaLabel = "También te puede interesar";

    movieListElem.innerHTML = `
        <article class="title_wrapper">
            <h3 class="title_large">También te puede interesar</h3>
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

// Cargar detalles de la película al cargar la página
loadMovieDetails(movieId);