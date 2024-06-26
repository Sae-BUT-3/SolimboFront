import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { FontAwesome } from "@expo/vector-icons"; // Importation de FontAwesome depuis react-native-vector-icons
import axiosInstance from "../../api/axiosInstance";
import { Colors } from "../../style/color";
import ItemPopup from "./ItemPopup";
import Loader from "../common/Loader";
import ErrorRequest from "../common/ErrorRequest";
import { useTranslation } from "react-i18next";
const DiscograpyPopup = ({ onClose, _id }) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [albums, setAlbums] = useState([]);
  const [singles, setSingles] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    axiosInstance
      .get("/spotify/fetchArtistSongs", {
        params: {
          id: _id,
          filter: "single",
          limit: 50,
        },
      })
      .then((response) => {
        setSingles(response.data);
      })
      .catch((e) => setError(e.response.data));

    axiosInstance
      .get("/spotify/fetchArtistSongs", {
        params: {
          id: _id,
          filter: "album",
          limit: 50,
        },
      })
      .then((response) => {
        setAlbums(response.data);
        setIsLoading(false);
      })
      .catch((e) => setError(e.response.data));
  }, []);
  if (error) {
    return <ErrorRequest err={error} />;
  }
  return isLoading ? (
    <Loader />
  ) : (
    <Modal isVisible={modalVisible} animationType="slide" transparent={true}>
      <ScrollView style={styles.container}>
        <Pressable
          style={styles.closeButton}
          onPress={() => setModalVisible(onClose)}
        >
          <FontAwesome name="close" size={30} color={Colors.White} solid />
        </Pressable>
        <View
          style={{ display: "flex", alignItems: "center", marginBottom: 30 }}
        >
          <Text style={styles.title}>{t("discography.detailled")}</Text>
        </View>
        <View style={{ marginLeft: 30, marginBottom: 30 }}>
          <Text style={styles.sectionTitle}>{t("album.plurialtitle")}</Text>
        </View>
        <View style={styles.item}>
          {albums
            .sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return dateA - dateB;
            })
            .map((item) => (
              <ItemPopup key={item.id} data={item} />
            ))}
        </View>
        <View style={{ marginLeft: 30, marginBottom: 30 }}>
          <Text style={styles.sectionTitle}>{t("single.plurialtitle")}</Text>
        </View>
        <View style={styles.item}>
          {singles
            .sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return dateA - dateB;
            })
            .map((item) => (
              <ItemPopup key={item.id} data={item} />
            ))}
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.Licorice,
    borderRadius: 20,
    padding: 30,
    position: "relative",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.White,
  },
  item: {
    display: "flex",
    flexDirection: "row",
    alignContent: "space-between",
    alignContent: "flex-start",
    flexWrap: "wrap",
    marginBottom: 30,
  },
  closeButton: {
    color: Colors.DarkSpringGreen,
    position: "relative",
    top: 0,
    right: 0,
    fontSize: 40,
  },
  sectionTitle: {
    color: Colors.DarkSpringGreen,
    fontWeight: "bold",
    fontSize: 27,
  },
});

export default DiscograpyPopup;
