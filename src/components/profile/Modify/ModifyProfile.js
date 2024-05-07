import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from "react-native";
import Svg, { Defs, G, Path } from "react-native-svg";

import { Colors } from "../../../style/color";
import { breakpoint } from "../../../style/breakpoint";
import * as ImagePicker from "expo-image-picker";
import axiosInstance from "../../../api/axiosInstance";
import ModifyForm from "./ModifyForm";
import hexToRgbA from "../../../utils/HexToRgbA";
import PressableBasic from "../../pressables/PressableBasic";
function ModifyProfile({
  user,
  handleQuit,
  checkPseudo,
  handleModify,
  handleLogout,
  handleResetPassword,
  handleResetEmail,
}) {
  const { height, width } = useWindowDimensions();
  const [isHovered, setIsHovered] = useState(false);
  const [image, setImage] = useState("");
  const [uri, setUri] = useState("");
  useEffect(() => {
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
      const formData = new FormData();
      var binaryImg = atob(result.assets[0].base64);
      // Convert binary to Blob
      var blob = new Blob(
        [
          new Uint8Array(
            Array.prototype.map.call(binaryImg, function (c) {
              return c.charCodeAt(0);
            })
          ),
        ],
        { type: "image/jpeg" }
      );

      formData.append("photo", blob, "image.jpeg"); // 'image' is the key where you'll access this image in your backend

      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJteS1zdWIiLCJ2YWx1ZSI6NTMsImF1ZCI6InVybjphdWRpZW5jZTp0ZXN0IiwiaXNzIjoidXJuOmlzc3Vlcjp0ZXN0IiwiaWF0IjoxNzEyMDU2MDY3LCJleHAiOjMzMjM4MDk4NDY3fQ.vHJbKGiwfghh3RdDWRrVy50IdJ3_Yib-HbyRCEe4fL4"}`,
      };
      await axiosInstance.post("/users/modify", formData, { headers });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      top: 0,
      width: "100%",
      height: "100%",
      backgroundColor: hexToRgbA(Colors.Jet, 0.4),
    },
    formContainer: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    ScrollView: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      margin: "auto",
      width: width > breakpoint.mobile ? breakpoint.mobile : width,
      height: width > breakpoint.mobile ? breakpoint.mobile : height,
      backgroundColor: Colors.Licorice,
      borderRadius: width > breakpoint.mobile ? 20 : 0,
    },
    image: {
      width: 200,
      height: 200,
      borderRadius: 100,
    },
    svgContainer: {
      position: "sticky",
      left: 10,
      top: 10,
      width: 40,
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      transition: "background-color 0.3s ease",
      paddingVertical: 2,
      paddingHorizontal: 10,
      borderRadius: 20,
      marginTop: 10,
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      transition: "background-color 0.3s ease",
    },
    svgContainerHovered: {
      backgroundColor: Colors.Jet,
    },
    quitBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
    bar: {
      width: "80%",
      borderWidth: 2,
      borderColor: Colors.DarkSpringGreen,
    },
    barContainer: {
      width: "100%",
      display: "flex",
      alignItems: "center",
    },
    ScrollViewContainer: {
      width: "100%",
      height: "100%",
    },
    buttonContainer: {
      display: "flex",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      <View onClick={handleQuit} style={styles.quitBackground}></View>
      <View style={styles.ScrollView}>
        <Pressable
          activeOpacity={1}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onPressIn={handleMouseEnter}
          onPressOut={handleMouseLeave}
          onPress={handleQuit}
          style={[
            styles.svgContainer,
            isHovered ? styles.svgContainerHovered : null,
          ]}
        >
          <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
            color="#eff3f4"
          >
            <Path
              stroke={"none"}
              fill={"#FFFFFF"}
              d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"
            />
          </Svg>
        </Pressable>
        <ScrollView style={styles.ScrollViewContainer}>
          <View style={styles.formContainer}>
            <ModifyForm
              user={user}
              checkPseudo={checkPseudo}
              handleModify={handleModify}
            ></ModifyForm>
          </View>
          <View style={styles.barContainer}>
            <View style={styles.bar}></View>
          </View>
          <View style={styles.buttonContainer}>
            <PressableBasic text="Se deconnecter" onPress={handleLogout} />

            {!user.auth_with_spotify && (
              <PressableBasic
                text="Reinitailiser mon mot de passe"
                onPress={handleResetPassword}
              />
            )}
            {!user.auth_with_spotify && (
              <PressableBasic
                text="Changer mon email"
                onPress={handleResetEmail}
              />
            )}
            <PressableBasic
              text="Supprimer mon compte"
              onPress={handleLogout}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export default ModifyProfile;
