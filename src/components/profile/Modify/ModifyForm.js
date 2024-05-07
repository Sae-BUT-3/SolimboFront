import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { Switch } from "react-native-switch";
import Svg, { Path } from "react-native-svg";
import { Colors } from "../../../style/color";
import { breakpoint } from "../../../style/breakpoint";
import * as ImagePicker from "expo-image-picker";
import axiosInstance from "../../../api/axiosInstance";
import ModifyInput from "./ModifyInput";
import hexToRgbA from "../../../utils/HexToRgbA";
import PressableBasic from "../../pressables/PressableBasic";
const MIN_PSEUDO = 3;
function ModifyForm({ user, checkPseudo, handleModify }) {
  const { height, width } = useWindowDimensions();
  const [imageHovered, setImageHovered] = useState(false);
  const [image, setImage] = useState("");
  const [uri, setUri] = useState("");
  const [actualAlias, setActualAlias] = useState("");
  const [actualPseudo, setActualPseudo] = useState("");
  const [actualBio, setActualBio] = useState("");
  const [pseudoError, setPseudoError] = useState("");
  const [aliasError, setAliasError] = useState("");
  const [isPseudoValid, setIsPseudoValid] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  useEffect(() => {
    setActualAlias(user?.alias);
    setActualPseudo(user?.pseudo);
    setActualBio(user?.bio);
    setIsPrivate(user?.is_private);
    console.log("is_private", user?.is_private);

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
      setPseudoError("Le pseudo est déjà pris");
      setIsPseudoValid(false);
    }
  };
  const handleBioChange = (value) => {
    setActualBio(value);
  };

  const styles = StyleSheet.create({
    container: {
      width: width - 100 > 500 ? 500 : width - 20,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    formContainer: {},
    imageContainer: {
      position: "relative",
      marginBottom: 10,
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
  });
  const handleSubmit = async () => {
    let valid = true;
    if (!isPseudoValid) {
      setPseudoError("Le pseudo est déjà pris");
      valid = false;
    }
    if (actualAlias.length < MIN_PSEUDO) {
      setAliasError("L'alias doit contenir au moins 3 caractères");
      valid = false;
    }
    if (actualPseudo.length < MIN_PSEUDO) {
      setPseudoError("Le pseudo doit contenir au moins 3 caractères");
      valid = false;
    }
    if (valid) {
      const formData = new FormData();
      if (image) {
        const binaryImg = atob(image.base64);
        // Convert binary to Blob
        const blob = new Blob(
          [
            new Uint8Array(
              Array.prototype.map.call(binaryImg, function (c) {
                return c.charCodeAt(0);
              })
            ),
          ],
          { type: "image/jpeg" }
        );

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

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: uri }} />
        <TouchableOpacity
          onPress={handleImagePickerPress}
          style={[styles.image, styles.imageChangeContainer]}
          onMouseEnter={() => setImageHovered(true)}
          onMouseLeave={() => setImageHovered(false)}
        >
          <Image
            style={styles.imageChange}
            source={require("../../../assets/images/photo.png")}
          />
        </TouchableOpacity>
      </View>
      <Switch
        value={isPrivate}
        onValueChange={(val) => setIsPrivate(val)}
        disabled={false}
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
        // width={"100%"}
        error={aliasError}
        value={user?.alias}
        onChangeText={handleAliasChange}
        onFocus={() => setAliasError("")}
      />
      <ModifyInput
        max={15}
        label="Pseudo"
        // width={"100%"}
        value={user?.pseudo}
        error={pseudoError}
        onChangeText={handlePseudoChange}
        onFocus={() => setPseudoError("")}
      />
      <ModifyInput
        max={200}
        multiline={true}
        numberOfLines={4}
        label="biographie"
        // width={"100%"}
        height={100}
        value={user?.bio}
        onChangeText={handleBioChange}
        onFocus={() => {}}
      />
      <PressableBasic text="Modifier" onPress={handleSubmit} />
    </View>
  );
}

export default ModifyForm;
