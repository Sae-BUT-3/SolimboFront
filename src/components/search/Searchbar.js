import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  Platform,
  ScrollView,
} from "react-native";
import Filter from "./Filter";
import Svg, { Path } from "react-native-svg";
import { Colors } from "../../style/color";
import { breakpoint } from "../../style/breakpoint";
import { useTranslation } from "react-i18next";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

function SearchBar({ keyPressHandler, filters, includeCancelButton = true }) {
  const { height, width } = useWindowDimensions();
  const allFilters = filters.map((item) => item.id);
  const [filterArray, setFilterArray] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const { t } = useTranslation();
  const styles = StyleSheet.create({
    diplayContainer: {
      display: "flex",
      flexDirection: "row",
      width: wp("100%"),
      alignItems: "flex-start",
      justifyContent: "flex-start",
      marginBottom: 15,
    },
    SearchBarContainer: {
      paddingBottom: 10,
      backgroundColor: Colors.Jet,
      borderRadius: 10,
      justifyContent: "flex-start",
      alignItems: "center",
      paddingLeft: 10,
      paddingTop: 10,
      width: Platform.OS === "web" ? wp("80%") : wp("95%"),
    },
    SearchBar: {
      display: "flex",
      flexDirection: "row",
      alignSelf: "flex-end",
      backgroundColor: Colors.Jet,
      width: Platform.OS === "web" ? "90%" : "75%",
      color: Colors.Silver,
      paddingTop: 5,
      marginLeft: 10,
      fontSize: 16,
    },
    filters: {
      gap: 10,
      overflowY:
        width < breakpoint.mobile && Platform.OS !== "web" ? "scroll" : "none",
      flexWrap: Platform.OS === "web" ? "wrap" : "nowrap",
    },
    cancelText: {
      color: Colors.Silver,
    },
  });

  function triggerSearch(text, filter) {
    const query = {};
    query.text = text.trim();
    query.filters = filter.length > 0 ? filter : allFilters;
    keyPressHandler(query);
  }
  function handleInputKeypress(text) {
    setInputValue(text);
    triggerSearch(text, filterArray);
  }
  function handleCancel() {
    setInputValue("");
    triggerSearch("", filterArray);
  }

  function handleFilterClick(id) {
    let newArray = [];
    if (filterArray.includes(id)) {
      newArray = filterArray.filter((item) => item !== id);
      setFilterArray(newArray);
    } else {
      filterArray.push(id);
      newArray = filterArray;
    }
    triggerSearch(inputValue, newArray);
  }

  return (
    <View style={[styles.container]}>
      <View style={[styles.diplayContainer, styles.SearchBarContainer]}>
        <Svg height="20" width="20">
          <Path
            fill="none"
            viewBox="0 0 20 20"
            strokeWidth="2"
            stroke={Colors.Silver}
            className="w-6 h-6"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </Svg>
        <TextInput
          style={styles.SearchBar}
          placeholder="Chercher"
          value={inputValue}
          placeholderTextColor="#B3B3B3"
          onChangeText={(text) => handleInputKeypress(text)}
        />

        {includeCancelButton && inputValue.length > 0 && (
          <Text style={styles.cancelText} onPress={handleCancel}>
            {t("common.cancel")}
          </Text>
        )}
      </View>

      <View style={[styles.diplayContainer, styles.filters]}>
        {filters.map((item, index) => (
          <Filter
            key={index}
            onPressHandler={() => handleFilterClick(item.id)}
            text={item.label}
          />
        ))}
      </View>
    </View>
  );
}

export default SearchBar;
