// Archivo: api.js

'use strict';

const api_key = 'a85be56dc67f8ab1e609b7a198187160';
const imageBaseURL = 'https://image.tmdb.org/t/p/';
const language = 'es-MX'; // Define el idioma aquí

/* fetch data from a server using the 'URL' and 
passes the result in JSON data to a 
'callback' function, along with an optional parameter if has 'optionalParam'
*/

const fetchDataFromServer = function(url, callback, optionalParam) {
    url += `&language=${language}`; // Agrega el idioma a la URL
    fetch(url)
        .then(response => response.json())
        .then(data => callback(data, optionalParam));
}

export { imageBaseURL, api_key, fetchDataFromServer };
