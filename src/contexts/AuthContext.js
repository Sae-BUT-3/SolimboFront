// AuthProvider.js

import { createContext, useContext, useState, useEffect } from 'react';
import Tokenizer from '../utils/Tokenizer';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [response, setResponse] = useState({ success: false, message: "Erreur lors de l'authentification, veuillez réessayer plus tard" })
  
  const signInViaToken = (token) => {
     axiosInstance.post("/users/confirmUser", {
      pseudo: "youyou ",
      alias: "yousrah",
      bio: "testBio",
      confirmToken: token
    }).then(response => {
        if(response.data.token) {
          Tokenizer.setToken(response.data.token);
          setIsAuthenticated(true); // Marquer l'utilisateur comme authentifié
          console.log("🚀 ~ Spotify ~ authentification réussie")
          setResponse({ success: true, message: "Authentification réussie" });
        }
        else {
          console.log("Connection failed, Token not found in response.")
          setResponse({success: false, message: "Échec de l'authentification, jeton non trouvé dans la réponse" });
        }
    }).catch(error => {
      console.log("Error : /users/confirmUser",error)
    })
    return response
  }

  const signIn = (credentials) => {
    axiosInstance.post("/users/signin",  credentials)
      .then(response => {
        if(response.data.token) {
          Tokenizer.setToken(response.data.token);
          setIsAuthenticated(true); // Marquer l'utilisateur comme authentifié
          console.log("🚀 ~ Spotify ~ authentification réussie")
          setResponse({ success: true, message: "Authentification réussie" });
        }
        else {
          console.log("Connection failed, Token not found in response.")
          setResponse({ success: false, message: "Échec de l'authentification, jeton non trouvé dans la réponse" });
        }
      })
      .catch(error => {
        console.log("Error : /users/signin",error)
        setResponse({ success: false, message: "Erreur lors de l'authentification, veuillez réessayer plus tard" });
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
    autoSignIn();
  }, []);

  const logout = () => {
    Tokenizer.clearToken();
    setIsAuthenticated(false); // Déconnecter l'utilisateur
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, logout , signInViaToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
