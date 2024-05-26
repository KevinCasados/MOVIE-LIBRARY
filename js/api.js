'use strict';

const api_key = 'a85be56dc67f8ab1e609b7a198187160';
const imageBaseURL = 'https://image.tmdb.org/t/p/';
const language = 'es-MX'; // Define el idioma aquí

const axiosDataFromServer = async function(url, callback, optionalParam) {
    url += `&language=${language}`; // Agrega el idioma a la URL
    try {
        const response = await axios.get(url);
        if (callback) {
            callback(response.data, optionalParam);
        }
        return response.data;
    } catch (error) {
        console.error('Error axios data from server:', error);
        throw error;
    }
}

export { imageBaseURL, api_key, axiosDataFromServer };