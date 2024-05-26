'use strict';

import {api_key, fetchDataFromServer} from "./api.js";


export function sidebar () {

    /** 
        * fetch all genres eg: [ { "id": "123", "name": "Action" } ]
        * then change genre formate eg: { 123: "Action" }
        */ 
    const genreList = {};

    fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function ({ genres }) { 
        for (const { id, name} of genres ) {
            genreList[id] = name;
        }
        
        genreLink();
    });

    const sidebarInner = document.createElement("div");
    sidebarInner.classList.add("sidebar_inner");

    sidebarInner.innerHTML = `
    <article class="sidebar_list">

        <p class="title">Género</p>
        
    </article>

    <article class="sidebar_list">
        <p class="title">Idioma</p>
        <a href="movie-list.html" menu_close class="sidebar_link" onclick='getMovieList("with_original_language=es", "Español")'>Español</a>
        <a href="movie-list.html" menu_close class="sidebar_link" onclick='getMovieList("with_original_language=en", "Inglés")'>Inglés</a>
        <a href="movie-list.html" menu_close class="sidebar_link" onclick='getMovieList("with_original_language=de", "Alemán")'>Alemán</a>
    </article>

    <article class="sidebar_footer">
        <p class="copyright">Copyright 2024 <a class="copyright_a" href="#">KevinCasados.Dev</a></p>
        <img src="img/tmdb-logo.svg" alt="the movie database logo">
    </article>
    `;

    const genreLink = function() {

        for (const [genreId, genreName] of Object.entries(genreList)) {

            const link = document.createElement("a");
            link.classList.add("sidebar_link");
            link.setAttribute("href", "./movie-list.html");
            link.setAttribute("menu_close", "");
            link.setAttribute("onclick", `getMovieList("with_genres=${genreId}", "${genreName}")`);
            link.textContent = genreName;

            sidebarInner.querySelectorAll(".sidebar_list")[0].
            appendChild(link);
        }

        const sidebar = document.querySelector("[sidebar]");
        sidebar.appendChild(sidebarInner);
        toggleSidebar(sidebar);

    }

    const toggleSidebar = function(sidebar) {
        //TOGGLE SIDEBAR IN MOBILE SCREEN

        const sidebarBtn = document.querySelector("[menu_btn]");
        const sidebarTogglers = document.querySelectorAll("[menu_toggler]");
        const sidebarClose = document.querySelectorAll("[menu_close]");
        const overlay = document.querySelector("[overlay]");

        addEventOnElements(sidebarTogglers, "click", function() {
            sidebar.classList.toggle("active");
            sidebarBtn.classList.toggle("active");
            overlay.classList.toggle("active");
        });

        addEventOnElements(sidebarClose, "click", function() {
            sidebar.classList.remove("active");
            sidebarBtn.classList.remove("active");
            overlay.classList.remove("active");
        });

    }
}