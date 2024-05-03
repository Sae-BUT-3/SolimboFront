import React, { useState, useEffect } from "react";
import { Text, TextInput, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Colors } from "../../../style/color";
import { breakpoint } from "../../../style/breakpoint";
import BasicInput from "../../form/BasicInput";
import commonStyles from "../../../style/commonStyle";
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
      fontWeight: "bold",
    },
    input: {
      width: width || "100%",
      height: height || 40,
      outline: "none",
      borderColor: "#FF0000",
      borderWidth: 2,
      borderColor: error ? "#FF0000" : Colors.Jet,
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
      color: "#FF0000",
      marginLeft: 10,
      marginBottom: 10,
    },
  });

  return (
    <View style={{ width: "100%" }}>
      <View style={[styles.labelContainer]}>
        <Text style={[styles.label, commonStyles.text, commonStyles.label]}>
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
        placeholderTextColor={Colors.BattleShipGray}
        theme={{ colors: { primary: "green", underlineColor: "transparent" } }}
        style={[
          commonStyles.input,
          //   focused && commonStyles.inputFocused,
          styles.input,
        ]}
      />
      <Text style={[commonStyles.text, styles.error]}>{error}</Text>
    </View>
  );
}

export default ModifyInput;
