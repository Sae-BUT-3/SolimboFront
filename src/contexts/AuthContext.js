// AuthProvider.js

import { createContext, useContext, useState, useEffect } from 'react';
import Tokenizer from '../utils/Tokenizer';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [response, setError] = useState(null)
  
  const signInViaToken = (token) => {
    return response
  }

  const signIn = (email, password) => {
    // const postData = {
    //   email: 'alban.talagrand2@gmail.com',
    //   password: 'testpassword'
    // };

    const postData = {
      email: email,
      password: password
    };
    
    axiosInstance.post("/users/signin", postData)
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
        console.log("Error : /users/signin " + error)
        setError("Échec de l'authentification, email ou mot de passe invalide !" );
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
