import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ScrollView,
  Platform,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons"; // Importation de FontAwesome5
import axiosInstance from "../../api/axiosInstance";
import { Colors } from "../../style/color";
import ItemPopup from "../../components/artist/ItemPopup";
import Loader from "../../components/common/Loader";
import ErrorRequest from "../../components/common/ErrorRequest";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";

const DiscograpyScreen = () => {
  const navigation = useNavigation();
  const { checkLogin } = useAuth();
  checkLogin(navigation);
  const [albums, setAlbums] = useState([]);
  const [singles, setSingles] = useState([]);
  const [filter, setFilter] = useState("album");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();
  const id = route.params?.id || null;
  const { t } = useTranslation();

  useEffect(() => {
    axiosInstance
      .get("/spotify/fetchArtistSongs", {
        params: {
          id: id,
          filter: "single",
        },
      })
      .then((response) => {
        setSingles(response.data);
      })
      .catch((e) => setError(e.response.data));

    axiosInstance
      .get("/spotify/fetchArtistSongs", {
        params: {
          id: id,
          filter: "album",
        },
      })
      .then((response) => {
        setAlbums(response.data);
        setIsLoading(false);
      })
      .catch((e) => setError(e.response.data));
    if (albums.length === 0) {
      setFilter("single");
    }
  }, [id]);

  if (error) {
    return <ErrorRequest err={error} />;
  }
  return (
    <View style={screenStyle.container}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Animated.View style={screenStyle.header}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}
            >
              <FontAwesome5
                name="chevron-left"
                size={25}
                color={Colors.White}
                style={{ paddingTop: 15 }}
              />
            </Pressable>
            <Text style={screenStyle.title}>{t("discography.title")}</Text>
            <Text />
          </Animated.View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              marginBottom: 15,
              flexWrap: "wrap",
              backgroundColor: "rgba(43, 43, 43, 0.3)",
              padding: 20,
            }}
          >
            <Pressable
              style={[
                screenStyle.filterButton,
                filter === "album" && {
                  backgroundColor: Colors.DarkSpringGreen,
                },
              ]}
              onPress={() => setFilter("album")}
              activeOpacity={1}
            >
              <Text style={[screenStyle.filterText, filter === "album"]}>
                {t("album.plurialtitle")}
              </Text>
            </Pressable>
            <Pressable
              style={[
                screenStyle.filterButton,
                filter === "single" && {
                  backgroundColor: Colors.DarkSpringGreen,
                },
              ]}
              onPress={() => setFilter("single")}
              activeOpacity={1}
            >
              <Text style={[screenStyle.filterText, filter === "single"]}>
                {t("single.plurialtitle")}
              </Text>
            </Pressable>
          </View>
          <ScrollView style={{ marginBottom: 30 }}>
            <View style={styles.item}>
              {filter === "album" &&
                albums
                  .sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateA - dateB;
                  })
                  .map((item) => <ItemPopup key={item.id} data={item} />)}
              {filter === "single" &&
                singles
                  .sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateA - dateB;
                  })
                  .map((item) => <ItemPopup key={item.id} data={item} />)}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: Colors.Licorice,
  },
});

export default DiscograpyScreen;
