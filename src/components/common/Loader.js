import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Colors } from "../../style/color";
import { useTranslation } from "react-i18next";

const Loader = () => {
  const { t } = useTranslation();
  const LoadingScreen = () => {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.DarkSpringGreen} />
        <Text style={styles.text}>{t("common.loading2")}</Text>
      </View>
    );
  };
  return <LoadingScreen />;
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
});

export default Loader;
