import React, { useState, useEffect } from 'react';;
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import {Colors} from "../../style/color";

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.DarkSpringGreen} />
      <Text style={styles.text}>Chargement en cours...</Text>
    </View>
  );
};


const Loader = () => {
    return <LoadingScreen />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Licorice, 
  },
  text: {
    color: Colors.White,
    fontSize: 20,
  }
});

export default Loader;
