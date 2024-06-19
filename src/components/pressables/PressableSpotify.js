import React, { useState } from "react";
import { Pressable, Text, Image } from "react-native";
import pressableBasicStyle from "../../style/pressableBasicStyle";
import authStyle from "../../style/authStyle";
import { useTranslation } from "react-i18next";

const PressableSpotify = ({ actionOnClick }) => {
  const [isPressed, setIsPressed] = useState(false);
  const { t } = useTranslation();
  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handlePress = () => {
    actionOnClick();
  };

  return (
    <Pressable
      style={[
        pressableBasicStyle.button,
        isPressed && pressableBasicStyle.buttonPressed,
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Image
        source={require("../../assets/images/spotify-icon-2048x2048.png")}
        style={authStyle.spotifyLogo}
      />

      <Text style={pressableBasicStyle.button_text}>
        {t("auth.loginwithspotify")}
      </Text>
    </Pressable>
  );
};

export default PressableSpotify;
