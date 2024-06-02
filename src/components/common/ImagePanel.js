import { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons"; // Importation de FontAwesome5
import { Colors } from "../../style/color";
import { Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "../../api/axiosInstance";
import GestureRecognizer from "react-native-swipe-gestures";
import { useTranslation } from "react-i18next";

const ImagePanel = ({ avatars, type, show, onRefresh }) => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const closeModal = () => {
    setIsModalVisible(false);
    show(false);
  };

  const onfollow = (item) => {
    if (type == "artist" || item?.type === "artist") {
      axiosInstance
        .post("/users/follow", { artistId: item.id })
        .then((res) => {
          onRefresh();
        })
        .catch((e) =>
          console.log(
            "Une erreur interne à notre serveur est survenue. Réessayer plus tard !"
          )
        );
    } else {
      axiosInstance.post("/amis/unfollow", {
        amiIdUtilisateur: item.id_utilisateur,
      });
      onRefresh()
        .then((res) => {})
        .catch((e) =>
          console.log(
            "Une erreur interne à notre serveur est survenue. Réessayer plus tard !"
          )
        );
    }
  };

  return (
    <GestureRecognizer onSwipeDown={closeModal}>
      <Modal
        isVisible={isModalVisible}
        style={styles.modal}
        swipeDirection={["down"]}
        onSwipeComplete={closeModal}
        onBackdropPress={closeModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.panelContainer}>
          <View style={{ paddingTop: 37 }}>
            <Pressable onPress={closeModal}>
              <FontAwesome name="close" size={30} color={Colors.Silver} />
            </Pressable>
          </View>
          <View style={styles.panelContent}>
            <FlatList
              data={avatars}
              renderItem={(
                { item } // Correction ici
              ) => (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                      gap: 15,
                    }}
                  >
                    <Pressable
                      onPress={() => {
                        if (type === "artist") {
                          closeModal();
                          navigation.navigate("artist", { id: item.id });
                        } else {
                          closeModal();
                          navigation.navigate("user", {
                            id: item.id_utilisateur,
                          });
                        }
                      }}
                    >
                      <Avatar.Image
                        size={56}
                        source={{
                          uri:
                            type === "user" || item?.type === "user"
                              ? item?.photo
                              : item?.image,
                        }}
                      />
                    </Pressable>
                    <Text numberOfLines={1} style={styles.panelText}>
                      {type === "user" || item?.type === "user"
                        ? item?.pseudo
                        : item?.name}
                    </Text>
                  </View>
                  <Pressable
                    style={styles.followButton}
                    activeOpacity={1}
                    onPress={() => onfollow(item)}
                  >
                    {type === "user" ||
                    item?.type === "user" ||
                    item.doesUserFollow ? (
                      <Text style={styles.buttonText}>
                        {t("friend.followed")}
                      </Text>
                    ) : (
                      <Text style={styles.buttonText}>
                        {t("friend.follow")}
                      </Text>
                    )}
                  </Pressable>
                </View>
              )}
              showsVerticalScrollIndicator={true}
            />
          </View>
        </View>
      </Modal>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  panelContainer: {
    flex: 1,
    backgroundColor: Colors.Jet,
    paddingLeft: 20,
    paddingRight: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 300,
  },
  panelContent: {
    backgroundColor: Colors.Onyx,
    borderRadius: 15,
    justifyContent: "space-around",
    marginTop: 10,
    paddingTop: 20,
    paddingBottom: 20,
  },
  panelText: {
    color: Colors.White,
    fontSize: 20,
    marginBottom: 20,
    maxWidth: 185,
  },
  buttonText: {
    color: Colors.White,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
  followButton: {
    backgroundColor: Colors.DarkSpringGreen,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === "android" ? 4 : 0,
    transition: "background-color 0.3s ease",
  },
});

export default ImagePanel;
