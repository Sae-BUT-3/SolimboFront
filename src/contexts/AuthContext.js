import { createContext, useContext, useState, useEffect } from 'react';
import Tokenizer from '../utils/Tokenizer';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signIn = (email, password) => {

    const postData = {
      email: 'alban.talagrand@gmail.com',
      password: 'testpassword'
    };
    
    axiosInstance.post("/users/signin", postData)
      .then(response => {
        console.log("🚀 ~ signIn ~ response:", response.data)
        const token = response.data.token;
        Tokenizer.setToken(token);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const autoSignIn = async () => {
    const token = await Tokenizer.getValidToken();

    if (token) {
      // Récupérer les informations de l'utilisateur avec le token
      // Vous devrez peut-être envoyer une requête au serveur pour valider le token et obtenir les données de l'utilisateur
      // Assurez-vous que le serveur est configuré pour vérifier et retourner les détails de l'utilisateur avec le token
      // Utilisez les informations récupérées pour définir l'utilisateur dans l'état local
      setUser({ email: 'user@example.com' }); // Remplacez par les données réelles de l'utilisateur
    }
  };

  useEffect(() => {
    autoSignIn();
  }, []); // S'exécute une fois au montage du composant

  const logout = () => {
    setUser(null);
    Tokenizer.clearToken();
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
