import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../style/color";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
const ErrorRequest = ({ err }) => {
  const { logout } = useAuth();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const returnHome = () => {
    if (err.statusCode === 401) {
      logout();
    } else {
      navigation.goBack();
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.errorCode}>{err.statusCode}</Text>
      <Text style={styles.errorMessage}>{err.message}</Text>
      <Pressable onPress={returnHome} style={styles.returnButton}>
        <Text style={styles.returnButtonText}>{t("common.return")}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.Licorice,
  },
  text: {
    color: Colors.White,
    fontSize: 20,
  },
  errorCode: {
    color: Colors.DarkSpringGreen,
    fontSize: 40,
    marginBottom: 10,
    textAlign: "center",
  },
  errorMessage: {
    color: Colors.White,
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  returnButton: {
    backgroundColor: Colors.DarkSpringGreen,
    padding: 10,
    borderRadius: 5,
  },
  returnButtonText: {
    color: Colors.White,
    fontSize: 16,
    textAlign: "center", // Centrer le texte
  },
});

export default ErrorRequest;
