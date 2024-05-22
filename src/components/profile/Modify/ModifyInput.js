import React, { useState, useEffect } from "react";
import { Text, TextInput, StyleSheet, View, Platform } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Colors } from "../../../style/color";
import { breakpoint } from "../../../style/breakpoint";
import BasicInput from "../../form/BasicInput";
import commonStyles from "../../../style/commonStyle";
import modalStyle from "../../../style/modalStyle";
function ModifyInput({
  max,
  label,
  width,
  height,
  value,
  error,
  onFocus,
  onChangeText,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const [actualLenght, setActualLenght] = useState(0);
  const [text, setText] = useState("");
  useEffect(() => {
    setText(value);
    setActualLenght(value?.length);
  }, [value]);
  const handleFocus = (e) => {
    onFocus();
    setFocused(true);
  };
  const handleBlur = () => {
    setFocused(false);
  };
  const handleTextChange = (actualText) => {
    if (actualText.length <= max) {
      setActualLenght(actualText.length);
      setText(actualText);
    }
    onChangeText(actualText);
  };

  const styles = StyleSheet.create({
    label: {
      color: Colors.White,
      fontSize: 18,
    },
    input: {
      width: width || "100%",
      height: height || 40,
      outline: "none",
      borderWidth: 1,
      borderColor: error ? Colors.Red : Colors.BattleShipGray,
      marginLeft: 0,
    },
    labelContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    counter: {
      paddingRight: 10,
    },
    error: {
      color: Colors.Red,
      marginLeft: 10,
      marginBottom: 10,
    },
  });

  return (
    <View style={{ width: 380 }}>
      <View style={[styles.labelContainer]}>
        <Text style={styles.label}>
          {label}
        </Text>
        {focused && (
          <Text style={[styles.counter, commonStyles.text]}>
            {actualLenght}/{max}
          </Text>
        )}
      </View>

      <TextInput
        {...props}
        value={text}
        onChangeText={handleTextChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={Colors.Silver}
        theme={{ colors: { primary: "green", underlineColor: "transparent" } }}
        style={[
          modalStyle.input, focused && modalStyle.inputFocused, {height: Platform.OS === 'web' ? '50%' : '20%'}
        ]}
      />
      <Text style={[commonStyles.text, styles.error]}>{error}</Text>
    </View>
  );
}

export default ModifyInput;
