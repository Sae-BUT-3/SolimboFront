// axiosInstance.js
import axios from "axios";
import { API_URL } from "@env";
import Tokenizer from "../utils/Tokenizer";

/**
 * Instance d'Axios préconfigurée pour l'application
 * @type {import('axios').AxiosInstance}
 */
const instance = axios.create({
  baseURL: "http://localhost:3001", // Créer un fichier .env à la racine et ajouter la variable API_URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajoutez un intercepteur pour inclure le token dans le header de chaque requête
instance.interceptors.request.use(
  async (config) => {
    const token = await Tokenizer.getValidToken();
    if (token) {
      config.headers.Authorization = `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJteS1zdWIiLCJ2YWx1ZSI6NTMsImF1ZCI6InVybjphdWRpZW5jZTp0ZXN0IiwiaXNzIjoidXJuOmlzc3Vlcjp0ZXN0IiwiaWF0IjoxNzEzMDM4MDg3fQ.8mvRRuuqZh7oedgL1kYSuA9xJVU8E4PDgMdbNQ7iH9I"}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
