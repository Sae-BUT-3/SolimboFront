import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable, Platform, FlatList } from "react-native";
import { Colors } from "../../style/color";
import Item from "./Item";
import { useTranslation } from "react-i18next";
import screenStyle from '../../style/screenStyle';

const ArtistAppearsOn = ({ items }) => {
  const [filter, setFilter] = useState("");
  const { t } = useTranslation();

  const EmptyList = () => (
    <View style={screenStyle.emptyListContainer}>
      <Text style={screenStyle.noItemsText}>{t("common.norelease")}</Text>
    </View>
  );

  return (
    <>
      {items.length > 0 ? (
        <View style={styles.sectionFilter}>
          <Pressable
            style={[
              screenStyle.filterButton,
              filter === "compilation" && {
                backgroundColor: Colors.DarkSpringGreen,
              },
            ]}
            onPress={() => setFilter("compilation")}
          >
            <Text style={[screenStyle.filterText, filter === "compilation"]}>
              {t("compilation.plurialtitle")}
            </Text>
          </Pressable>
          <Pressable
            style={[
              screenStyle.filterButton,
              filter === "album" && { backgroundColor: Colors.DarkSpringGreen },
            ]}
            onPress={() => setFilter("album")}
          >
            <Text style={[screenStyle.filterText, filter === "album"]}>
              {t("album.plurialtitle")}
            </Text>
          </Pressable>
        </View>
      ) : null}
      <FlatList
        data={ items
          .filter(item => item.type.toLowerCase().includes(filter.toLowerCase()))
          .slice(0, Platform.OS === 'web' ? 6 : 4)
          .sort((a, b) => new Date(a.date) - new Date(b.date))}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) =>
          <Item data={item} />
        }
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
        ListEmptyComponent={<EmptyList />}
        horizontal={Platform.OS === 'web'}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
};

const styles = StyleSheet.create({
  sectionFilter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 30,
    marginBottom: 30
  },
});

export default ArtistAppearsOn;
