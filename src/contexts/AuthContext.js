// AuthContext.js
import { createContext, useContext, useState } from 'react';
import Tokenizer from '../utils/Tokenizer';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const tokenize = new Tokenizer();

  const signIn = (email, password) => {

    const postData = {
      email: 'alban.talagrand@gmail.com',
      password: 'testpassword'
    };
    
    axiosInstance.post("/users/signin", postData)
      .then(response => {
        // Traitement de la réponse
        console.log(response.data);
      })
      .catch(error => {
        // Gestion des erreurs
        console.error(error);
      });
  
    // instance.post('/users/signin', {
    //   email: email,
    //   password: password,
    // }, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })
    //   .then((response) => {
    //     console.log("🚀 ~ file: AuthContext.js:65 ~ signIn ~ response", response);
    //     // Pas besoin de response.json() ici avec Axios, la réponse est déjà en format JSON
    //     const data = response.data;
        
    //     if (data.error) {
    //       throw new Error(data.error);
    //     }
  
    //     tokenize.setToken(data);
    //     setUser({
    //       email: email,
    //       password: password,
    //     });
    //   })
    //   .catch(error => {
    //     console.error(error);
    //     console.error(JSON.stringify(error));
    //   });
  };
  

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
