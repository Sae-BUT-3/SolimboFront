import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Platform,
  StyleSheet,
  Keyboard,
} from "react-native"; // Importez Keyboard
import PressableBasic from "../../components/pressables/PressableBasic";
import { useAuth } from "../../contexts/AuthContext";
import commonStyles from "../../style/commonStyle";
import authStyle from "../../style/authStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import BasicInput from "../../components/form/BasicInput";
import PressableSpotify from "../../components/pressables/PressableSpotify";
import { useLinkTo, useNavigation } from "@react-navigation/native";
import { Snackbar } from "react-native-paper";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useTranslation } from "react-i18next";
WebBrowser.maybeCompleteAuthSession();
const scopes = [
  "user-read-private",
  "user-read-email",
  "user-library-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-follow-read",
  "user-follow-modify",
  "user-library-read",
  "user-library-modify",
  "user-top-read",
  "user-read-recently-played",
  "ugc-image-upload",
];
// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

function SignInScreen({ navigation }) {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const linkTo = useLinkTo();
  
  const handleSignIn = () => {
    const credentials = {
      email: email,
      password: password,
    };
    signIn(credentials).then((data) => {
      console.log("datacredentials",data)
      navigation.navigate("navigate");
    }).catch(error => {
      let errorMsg = "La connexion à votre compte a échoué."
      setError(errorMsg);
    });
  };
  const handleClose = () => {
    setError(null);
  };

  const redirectUri = makeRedirectUri({
    scheme: "solimbo",
    preferLocalhost: true,
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.CLIENT_ID,
      scopes,
      usePKCE: false, // To follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      redirectUri,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      navigation.navigate("confirm-user", { code, redirectUri });
    }
  }, [response]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView
      style={[commonStyles.safeAreaContainer, { justifyContent: "normal" }]}
      onTouchStart={dismissKeyboard}
    >
      <View
        style={[commonStyles.columnCenterContainer, authStyle.formContainer]}
      >
        <View style={commonStyles.columnCenterContainer}>
          <Image
            source={require("../../assets/images/main_logo_no_bg.png")}
            style={commonStyles.logo}
          />
        </View>
        <View style={commonStyles.columnCenterContainer}>
          <BasicInput
            autoCapitalize="none"
            autoCorrect={false}
            placeholder={t("auth.typeemail")}
            textContentType="emailAddress"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <BasicInput
            placeholder={t("auth.typepassword")}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <PressableBasic text={t("auth.login")} onPress={handleSignIn} />

        </View>

        <View style={authStyle.lineContainer}>
          <View style={authStyle.line} />
          <Text style={[commonStyles.text, authStyle.textOr]}>OU</Text>
          <View style={authStyle.line} />
        </View>

        <View style={commonStyles.columnCenterContainer}>
          <PressableSpotify actionOnClick={promptAsync} />
        </View>
      </View>

      <View style={commonStyles.row}>
        <Text style={[commonStyles.text, authStyle.noAccount]}>
          {t("auth.noaccount")}
        </Text>
        <Text
          style={commonStyles.textLink}
          onPress={() => navigation.navigate("signup")}
        >
          {t("auth.signup")}
        </Text>
      </View>
      {error && (
        <Snackbar
          visible={error !== null}
          onDismiss={handleClose}
          action={{
            label: t("common.close"),
            onPress: handleClose,
          }}
          duration={Snackbar.DURATION_LONG}
          elevation={3}
          style={{ width: Platform.OS == "web" ? 500 : 400 }}
        >
          {error}
        </Snackbar>
      )}
    </SafeAreaView>
  );
}

export default SignInScreen;
