import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Classe Tokenizer pour gérer les opérations liées aux tokens.
 */
export default class Tokenizer {
  /**
   * Efface tous les éléments de l'AsyncStorage.
   * @returns {Promise<void>}
   */
  static clearToken = async () => {
    await AsyncStorage.clear();
  };

  /**
   * Enregistre un token dans l'AsyncStorage.
   * @param {Object} token - Le token à enregistrer.
   * @returns {Promise<void>}
   */
  static setToken = async (token) => {
    await AsyncStorage.setItem("tokenObj", JSON.stringify(token));
  };

  /**
   * Enregistre les donnes de l'utilisateur connecté dans l'AsyncStorage.
   * @param {Object} user - Les donnees utilisateur à enregistrer.
   * @returns {Promise<void>}
   */
  static setUser = async (user) => {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  };

  /**
   * Récupère un token valide de l'AsyncStorage.
   * Si aucun token n'est trouvé, retourne null.
   * @returns {Promise<Object|null>} Le token récupéré ou null.
   */
  static getCurrentUser = async () => {
    const user = await AsyncStorage.getItem("user");
    if (!user || user === "undefined") {
      await Tokenizer.clearToken();
      return null;
    }
    return JSON.parse(user) || null;
  };

  /**
   * Récupère un token valide de l'AsyncStorage.
   * Si aucun token n'est trouvé, retourne null.
   * @returns {Promise<Object|null>} Le token récupéré ou null.
   */
  static getValidToken = async () => {
    const token = await AsyncStorage.getItem("tokenObj");
    if (!token || token === "undefined") {
      await Tokenizer.clearToken();
      return null;
    }
    return JSON.parse(token) || null;
  };
}
