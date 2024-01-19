// axiosInstance.js
import axios from 'axios';
import { API_URL } from "@env";

/**
 * Instance d'Axios préconfigurée pour l'application
 * @type {import('axios').AxiosInstance}
 */
const instance = axios.create({
    baseURL: API_URL, // Créer un fichier .env à la racine et ajouter la variable API_URL
    headers: {
        'Content-Type': 'application/json',
        // Ajoutez d'autres en-têtes communs si nécessaire
    },
});

export default instance;
