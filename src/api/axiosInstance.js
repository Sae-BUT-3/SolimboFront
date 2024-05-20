// axiosInstance.js
import axios from "axios";
import { API_URL } from "@env";
import Tokenizer from "../utils/Tokenizer";

/**
 * Instance d'Axios préconfigurée pour l'application
 * @type {import('axios').AxiosInstance}
 */
const instance = axios.create({
  baseURL: "http://192.168.1.10:3001", //Créer un fichier .env à la racine et ajouter la variable API_URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajoutez un intercepteur pour inclure le token dans le header de chaque requête
instance.interceptors.request.use(
  async (config) => {
    const token = await Tokenizer.getValidToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
