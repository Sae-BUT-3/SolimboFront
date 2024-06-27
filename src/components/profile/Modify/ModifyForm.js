import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { Switch } from "react-native-switch";
import { Colors } from "../../../style/color";
import { breakpoint } from "../../../style/breakpoint";
import * as ImagePicker from "expo-image-picker";
import axiosInstance from "../../../api/axiosInstance";
import ModifyInput from "./ModifyInput";
import hexToRgbA from "../../../utils/HexToRgbA";
import pressableBasicStyle from "../../../style/pressableBasicStyle";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import BasicInput from "../../form/BasicInput";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../contexts/AuthContext";
import { Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Buffer } from "buffer";
import { useTranslation } from "react-i18next";
const MIN_PSEUDO = 3;

const Update = ({ user, spotify }) => {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { logout } = useAuth();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const styles = StyleSheet.create({
    buttonText: {
      color: Colors.White,
      marginBottom: 10,
    },
    input: {
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      marginBottom: 10,
      paddingLeft: 8,
    },
    divider: {
      height: 2,
      borderColor: Colors.Silver,
      marginVertical: 10,
    },
    updateContainer: {
      justifyContent: "center",
    },
    updateButtonsContainer: {
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "baseline",
      flexWrap: "wrap",
      gap: 20,
    },
    centeredContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    actionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "center",
    },
    actionButton: {
      width: 120,
    },
    cancelButton: {
      backgroundColor: Colors.Red,
      width: 120,
    },
    icon: {
      paddingRight: 10,
    },
  });
  const handleResetPassword = () => {
    setShowPasswordInput(!showPasswordInput);
  };

  const handleUpdateEmail = () => {
    setShowEmailInput(!showEmailInput);
  };

  const handleSubmitEmail = () => {
    axiosInstance
      .post("users/sendResetEmail", { email })
      .then(() => {
        setShowEmailInput(false);
        Toast.show({
          type: "success",
          text1: t("auth.emailupdated"),
          text1Style: { color: Colors.White },
          position: "bottom",
        });
      })
      .catch(() => {
        // Handle error
      });
  };

  const handleSubmitPassword = () => {
    axiosInstance
      .post("users/resetPassword", { password, resetToken: user.reset_token })
      .then(() => {
        setShowPasswordInput(false);
        Toast.show({
          type: "success",
          text1: t("auth.passwordupdated"),
          text1Style: { color: Colors.White },
          position: "bottom",
        });
      })
      .catch(() => {
        // Handle error
      });
  };

  return (
    <View style={styles.updateContainer}>
      <View style={styles.updateButtonsContainer}>
        {spotify && (
          <Pressable onPress={handleUpdateEmail}>
            <Text style={styles.buttonText}>{t("auth.updateemail")}</Text>
          </Pressable>
        )}
        <Divider style={styles.divider} />
        {spotify && (
          <Pressable onPress={handleResetPassword}>
            <Text style={styles.buttonText}>{t("auth.updatepassword")}</Text>
          </Pressable>
        )}

        <Pressable
          onPress={() => {
            logout();
            navigation.navigate("signin");
          }}
        >
          <Text style={[styles.text, { color: Colors.Red }]}>
            {t("auth.logout")}
          </Text>
        </Pressable>
      </View>

      <View style={styles.centeredContainer}>
        {showEmailInput && (
          <>
            <BasicInput
              autoCapitalize="none"
              autoCorrect={false}
              placeholder={t("auth.newemail")}
              textContentType="emailAddress"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <View style={styles.actionButtonsContainer}>
              <Pressable
                style={[pressableBasicStyle.button,  styles.actionButton]}
                onPress={handleSubmitEmail}
              >
                <FontAwesome
                  size={20}
                  name="pencil"
                  color={Colors.White}
                  style={styles.icon}
                />
                <Text style={pressableBasicStyle.button_text}>
                  {t("common.modify")}
                </Text>
              </Pressable>
              <Pressable
                style={[
                  pressableBasicStyle.button,
                  styles.cancelButton,
                ]}
                onPress={() => setShowEmailInput(false)}
              >
                <FontAwesome
                  size={20}
                  name="close"
                  color={Colors.White}
                  style={styles.icon}
                />
                <Text style={pressableBasicStyle.button_text}>
                  {t("common.cancel")}
                </Text>
              </Pressable>
            </View>
          </>
        )}
        {showPasswordInput && (
          <>
            <BasicInput
              style={styles.input}
              placeholder={t("auth.newpassword")}
              secureTextEntry
              onChangeText={setPassword}
              value={password}
            />
            <View style={styles.actionButtonsContainer}>
              <Pressable
                style={[pressableBasicStyle.button, styles.actionButton]}
                onPress={handleSubmitPassword}
              >
                <FontAwesome
                  size={20}
                  name="pencil"
                  color={Colors.White}
                  style={styles.icon}
                />
                <Text style={pressableBasicStyle.button_text}>
                  {t("common.modify")}
                </Text>
              </Pressable>
              <Pressable
                style={[
                  pressableBasicStyle.button,
                  styles.cancelButton,
                ]}
                onPress={() => setShowPasswordInput(false)}
              >
                <FontAwesome
                  size={20}
                  name="close"
                  color={Colors.White}
                  style={styles.icon}
                />
                <Text style={pressableBasicStyle.button_text}>
                  {t("common.cancel")}
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

function ModifyForm({ user, checkPseudo, handleModify, isModify, setModify }) {
  const windowDimensions = useWindowDimensions();
  const width = windowDimensions ? windowDimensions.width : 0;
  const [imageHovered, setImageHovered] = useState(false);
  const [image, setImage] = useState("");
  const [uri, setUri] = useState(undefined);
  const [actualAlias, setActualAlias] = useState("");
  const [actualPseudo, setActualPseudo] = useState("");
  const [actualBio, setActualBio] = useState("");
  const [pseudoError, setPseudoError] = useState("");
  const [aliasError, setAliasError] = useState("");
  const [isPseudoValid, setIsPseudoValid] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [spotify, setAuthSpotify] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  useEffect(() => {
    setActualAlias(user?.alias);
    setActualPseudo(user?.pseudo);
    setActualBio(user?.bio);
    setIsPrivate(user?.is_private);
    setAuthSpotify(user?.auth_with_spotify);
    setUri(
      user?.photo ||
        "https://merriam-webster.com/assets/mw/images/article/art-wap-article-main/egg-3442-e1f6463624338504cd021bf23aef8441@1x.jpg"
    );
  }, [user]);

  const handleImagePickerPress = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
      setUri(result.assets[0].uri);
    }
  };

  const handleAliasChange = (value) => {
    setActualAlias(value);
  };

  const handlePseudoChange = async (value) => {
    setPseudoError("");
    setActualPseudo(value);
    setIsPseudoValid(true);
    if (value !== user.pseudo && !(await checkPseudo(value))) {
      setPseudoError("Le pseudo est déjà pris");
      setIsPseudoValid(false);
    }
  };

  const handleBioChange = (value) => {
    setActualBio(value);
  };

  const handleSubmit = async () => {
    let valid = true;
    if (!isPseudoValid) {
      setPseudoError(t("auth.errors.alreadytaken"));
      valid = false;
    }
    if (actualAlias.length < MIN_PSEUDO) {
      setAliasError(t("auth.errors.aliaslength"));
      valid = false;
    }
    if (actualPseudo.length < MIN_PSEUDO) {
      setPseudoError(t("auth.errors.pseudolength"));
      valid = false;
    }
    if (valid) {
      const formData = new FormData();
      if (image) {
        // Convertir binaire en un tableau d'octets
        const binaryImg = Buffer.from(image.base64, "base64");

        // Convertir binaire en un tableau d'octets
        const arrayBuffer = Uint8Array.from(binaryImg);

        const blob = new Blob([arrayBuffer], { type: "image/jpeg" });

        formData.append("photo", blob, "image.jpeg");
      }
      if (actualAlias !== user.alias) {
        formData.append("alias", actualAlias);
      }
      if (actualPseudo !== user.pseudo) {
        formData.append("pseudo", actualPseudo);
      }
      if (actualBio !== user.bio) {
        formData.append("bio", actualBio);
      }
      formData.append("isPrivate", isPrivate);
      handleModify(formData);
    }
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      backgroundColor: Colors.Licorice,
    },
    imageContainer: {
      position: "relative",
      marginBottom: 10,
      marginTop: 20,
      backgroundColor: Colors.Licorice,
    },
    image: {
      width: width > breakpoint.small ? 200 : 150,
      height: width > breakpoint.small ? 200 : 150,
      borderRadius: width < breakpoint.medium ? 100 : 75,
    },
    imageChangeContainer: {
      position: "absolute",
      top: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: hexToRgbA(Colors.Jet, imageHovered ? 0.1 : 0.4),
    },
    imageChange: {
      width: "70%",
      height: "70%",
    },
    switch: {
      marginBottom: 10,
    },
    header: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    buttonText: {
      color: Colors.White,
      marginBottom: 10,
    },
    input: {
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      marginBottom: 10,
      paddingLeft: 8,
    },
    divider: {
      height: 2,
      borderColor: Colors.Silver,
      marginVertical: 10,
    },
    updateContainer: {
      justifyContent: "center",
    },
    updateButtonsContainer: {
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "baseline",
      flexWrap: "wrap",
      gap: 20,
    },
    centeredContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    actionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "center",
    },
    actionButton: {
      width: 120,
    },
    cancelButton: {
      backgroundColor: Colors.Red,
      width: 120,
    },
    icon: {
      paddingRight: 10,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: uri }} />
        {isModify && (
          <Pressable
            onPress={handleImagePickerPress}
            style={[styles.image, styles.imageChangeContainer]}
            onMouseEnter={() => setImageHovered(true)}
            onMouseLeave={() => setImageHovered(false)}
          >
            <Image
              style={styles.imageChange}
              source={require("../../../assets/images/photo.png")}
            />
          </Pressable>
        )}
      </View>
      <Switch
        value={isPrivate}
        onValueChange={(val) => setIsPrivate(val)}
        disabled={!isModify}
        activeText={"Privé"}
        inActiveText={"Public"}
        backgroundActive={Colors.SeaGreen}
        backgroundInactive={Colors.Jet}
        circleActiveColor={Colors.CalPolyGreen}
        circleInActiveColor={Colors.Licorice}
        circleSize={20.25}
        barHeight={27}
        circleBorderWidth={0}
        switchLeftPx={2.5}
        switchRightPx={2.5}
        switchWidthMultiplier={4.1}
        style={styles.switch}
      />
      <ModifyInput
        max={15}
        label="Alias"
        error={aliasError}
        value={actualAlias}
        onChangeText={handleAliasChange}
        onFocus={() => setAliasError("")}
        disabled={!isModify}
      />
      <ModifyInput
        max={15}
        label="Pseudo"
        value={actualPseudo}
        error={pseudoError}
        onChangeText={handlePseudoChange}
        onFocus={() => setPseudoError("")}
        disabled={!isModify}
      />
      <ModifyInput
        max={200}
        multiline={true}
        numberOfLines={4}
        label="Biographie"
        height={100}
        value={actualBio}
        onChangeText={handleBioChange}
        onFocus={() => setPseudoError("")}
        disabled={!isModify}
      />
      {isModify && (
        <View style={styles.actionButtonsContainer}>
          <Pressable
            style={[pressableBasicStyle.button, styles.actionButton]}
            onPress={handleSubmit}
          >
            <FontAwesome
              size={20}
              name="pencil"
              color={Colors.White}
              style={styles.icon}
            />
            <Text style={pressableBasicStyle.button_text}>Modifier</Text>
          </Pressable>
          <Pressable
            style={[
              pressableBasicStyle.button,
              styles.cancelButton,
            ]}
            onPress={() => setModify(false)}
          >
            <FontAwesome
              size={20}
              name="close"
              color={Colors.White}
              style={styles.icon}
            />
            <Text style={pressableBasicStyle.button_text}>Annuler</Text>
          </Pressable>
        </View>
      )}
      <Update user={user} spotify={spotify} />
    </View>
  );
}

export default ModifyForm;
