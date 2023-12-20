// AuthContext.js
import { createContext, useContext, useState } from 'react';
import Tokenizer from '../utils/Tokenizer';
import axios from 'axios';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const tokenize = new Tokenizer();

  const signIn = (email, password) => {

    axios.post('api/users/signin',
    { 
      email: email,
      password: password,
    })
    .then((response) => {
      if (response.status == 201) {
        let { data } = response;
        if (data.error) {
          throw new Error(data.error);
        }
        tokenize.setToken(data);
        setUser(
          {
            email: email,
            password: password,
          }
        );
      }
    })
    .catch((error) => {
      console.log("🚀 ~ file: AuthContext.js:36 ~ login ~ error:", error)
    });
  }

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
