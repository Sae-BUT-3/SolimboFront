// AuthProvider.js

import { createContext, useContext, useState, useEffect } from 'react';
import Tokenizer from '../utils/Tokenizer';
import axiosInstance from '../api/axiosInstance';
import { err } from 'react-native-svg';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [response, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const signInViaToken = (data) => {
    Tokenizer.setToken(data.token);
    Tokenizer.setUser(data.user)
    setIsAuthenticated(true);
  }

  const signIn = (credentials) => {
    axiosInstance.post("/users/signin", credentials)
      .then(response => {
        if(response.data) {
          Tokenizer.setToken(response.data.token);
          Tokenizer.setUser(response.data.user)
          setIsAuthenticated(true); // Marquer l'utilisateur comme authentifié
          console.log("🚀 ~ Connexion ~ authentification réussie")
        }
        else {
          console.log("Connection failed, Token and data user not found in response.")
          setError("Échec de l'authentification, jeton non trouvé dans la réponse" );
        }
      })
      .catch(error => {
        console.log("Error : /users/signin " + error.response.data)
        setError("L'email/pseudo ou le mot de passe est incorrect, veuillez ressayer !" );
      });
      return response
  };

  const autoSignIn = async () => {
    const token = await Tokenizer.getValidToken();
    if (token) {
      setIsAuthenticated(true); // Marquer l'utilisateur comme authentifié
    }
  };

  useEffect(() => {
    autoSignIn().then(() => setIsLoading(false));
  }, []);

  const logout = () => {
    Tokenizer.clearToken();
    setIsAuthenticated(false); // Déconnecter l'utilisateur
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, logout , signInViaToken }}>
      {isLoading ? (
        null
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
