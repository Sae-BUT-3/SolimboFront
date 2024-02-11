// AuthProvider.js

import { createContext, useContext, useState, useEffect } from 'react';
import Tokenizer from '../utils/Tokenizer';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signInViaToken = (token) => {
    Tokenizer.setToken(token);
    setIsAuthenticated(true); // Marquer l'utilisateur comme authentifié
  }

  const signIn = (email, password) => {
    const postData = {
      email: 'alban.talagrand2@gmail.com',
      password: 'testpassword'
    };
    
    axiosInstance.post("/users/signin", postData)
      .then(response => {
        console.log("🚀 ~ signIn ~ response:", response.data)
        const token = response.data.token;
        Tokenizer.setToken(token);
        setIsAuthenticated(true); // Marquer l'utilisateur comme authentifié
      })
      .catch(error => {
        console.error(error);
      });
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
