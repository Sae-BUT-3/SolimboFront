import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import axiosInstance from "../api/axiosInstance";
import { Colors } from "../style/color";
import { Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Loader from "../components/common/Loader";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
function ActivityScreen() {
  const [tab, setTab] = useState("2");
  const [requests, setRequest] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    update();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const update = () => {
    setIsLoading(true);
    axiosInstance
      .get("/amis/request")
      .then((res) => {
        setRequest(res.data.requestsReceived);
        setIsLoading(false);
      })
      .catch((e) => {});
  };

  const accept = (id) => {
    axiosInstance
      .post("/amis/accept", {
        amiIdUtilisateur: id,
      })
      .then((res) => {
        update();
        Toast.show({
          type: "success",
          text1: t("friend.accept"),
          text1Style: { color: Colors.White },
          position: "bottom",
        });
      })
      .catch((e) => {
        Toast.show({
          type: "error",
          text1: t("common.unespected"),
          text1Style: { color: Colors.White },
          position: "bottom",
        });
      });
  };
  const reject = (id) => {
    axiosInstance
      .post("/amis/unfollow", { amiIdUtilisateur: id })
      .then((res) => {
        update();
        Toast.show({
          type: "success",
          text1: t("friend.reject"),
          text1Style: { color: Colors.White },
          position: "bottom",
        });
      })
      .catch((e) => {
        console.log(e);
        Toast.show({
          type: "error",
          text1: t("common.unespected"),
          text1Style: { color: Colors.White },
          position: "bottom",
        });
      });
  };
  useEffect(() => {
    update();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.tab}>
        <Pressable
          style={[
            styles.tabButton,
            { backgroundColor: tab == "1" ? Colors.Onyx : Colors.Jet },
          ]}
          onPress={() => setTab("1")}
        >
          <Text style={styles.buttonText}>{t("activity.title")}</Text>
        </Pressable>
        <Pressable
          style={[
            styles.tabButton,
            { backgroundColor: tab == "2" ? Colors.Onyx : Colors.Jet },
          ]}
          onPress={() => setTab("2")}
        >
          <Text style={styles.buttonText}>{t("friend.request")}</Text>
        </Pressable>
      </View>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {tab == "2" && (
            <FlatList
              data={requests}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    padding: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 15,
                    }}
                  >
                    <Pressable
                      onPress={() => {
                        navigation.navigate("user", {
                          id: item.id_utilisateur,
                        });
                      }}
                    >
                      <Avatar.Image size={56} source={{ uri: item.photo }} />
                    </Pressable>
                    <Text
                      numberOfLines={1}
                      style={[styles.text, { color: Colors.White }]}
                    >
                      {item.pseudo}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: 20,
                    }}
                  >
                    <Pressable
                      style={styles.followButton}
                      activeOpacity={1}
                      onPress={() => accept(item.id_utilisateur)}
                    >
                      <FontAwesome
                        name="check"
                        color={Colors.White}
                        size={20}
                      />
                    </Pressable>
                    <Pressable
                      style={[
                        styles.followButton,
                        { backgroundColor: Colors.Red },
                      ]}
                      activeOpacity={1}
                      onPress={() => reject(item.id_utilisateur)}
                    >
                      <FontAwesome
                        name="close"
                        color={Colors.White}
                        size={20}
                      />
                    </Pressable>
                  </View>
                </View>
              )}
              ListEmptyComponent={
                <View
                  style={{
                    justifyContent: "space-around",
                    gap: 55,
                    alignItems: "center",
                  }}
                >
                  <Text />
                  <ImageBackground
                    source={require("../assets/images/main_logo_v1_500x500.png")}
                    style={{ width: 165, height: 165, opacity: 0.3 }}
                  />
                  <Text style={styles.text}>{t("friend.norequest")}</Text>
                </View>
              }
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.SeaGreen]}
                  tintColor={Colors.SeaGreen}
                />
              }
            />
          )}
          {tab == "1" && (
            <View
              style={{
                justifyContent: "space-around",
                gap: 55,
                alignItems: "center",
              }}
            >
              <Text />
              <ImageBackground
                source={require("../assets/images/main_logo_v1_500x500.png")}
                style={{ width: 165, height: 165, opacity: 0.3 }}
              />
              <Text />
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.Licorice,
    flex: 1,
    paddingTop: 50,
    gap: 10,
  },
  tab: {
    borderRadius: 30,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: Colors.Jet,
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "row",
    padding: 8,
  },
  tabButton: {
    borderRadius: 30,
    width: 170,
    padding: 15,
  },
  buttonText: {
    color: Colors.White,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  followButton: {
    backgroundColor: Colors.SeaGreen,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: Colors.Onyx,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: Platform.OS === "android" ? 4 : 0,
    transition: "background-color 0.3s ease",
  },
  text: {
    fontSize: Platform.OS === "web" ? 20 : 16,
    color: Colors.Celadon,
    marginBottom: 10,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default ActivityScreen;
