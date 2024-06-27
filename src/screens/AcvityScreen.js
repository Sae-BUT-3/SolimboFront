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
import { useAuth } from "../contexts/AuthContext";
import Notification from "../components/activity/Notification";
import screenStyle from '../style/screenStyle';
import { widthPercentageToDP } from 'react-native-responsive-screen';

function ActivityScreen() {
  const [tab, setTab] = useState("1");
  const [requests, setRequest] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();
  const [refreshingNotificatons, setRefreshingNotificatons] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();
  const { checkLogin } = useAuth();
  checkLogin(navigation);

  const onRefreshNotificatons = useCallback(() => {
    setRefreshingNotificatons(true);
    updateNotifications();
    setTimeout(() => {
      setRefreshingNotificatons(false);
    }, 2000);
  }, []);

  const updateNotifications = () => {
    if (refreshingNotificatons) setIsLoading(true);
    axiosInstance
      .get("/notifications", {
        params: { page: 1, pageSize: 100},
      }).then((res) => {
        setNotifications(res.data);
        if (refreshingNotificatons) setIsLoading(false);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    update();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const update = () => {
    if (refreshing) setIsLoading(true);
    axiosInstance
      .get("/amis/request")
      .then((res) => {
        setRequest(res.data.requestsReceived);
        if (refreshing) setIsLoading(true);
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
    if (tab == "1") {
      updateNotifications();
    }else{
      update();
    }
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
          {tab == "1" && (
            <FlatList
              scrollEnabled={true}
              data={notifications}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    padding: 10,
                  }}
                >
                  <Notification data={item} />
                </View>
              )}
              ListEmptyComponent={
                <View style={screenStyle.emptyListContainer} >
                  <Text />
                  <ImageBackground
                    source={require("../assets/images/main_logo_v1_500x500.png")}
                    style={screenStyle.emptyImage}
                  />
                  <Text style={screenStyle.text}>{t("activity.nonotification")}</Text>
                </View>
              }
              showsVerticalScrollIndicator={true}
              refreshControl={
                <RefreshControl
                  refreshing={refreshingNotificatons}
                  onRefresh={onRefreshNotificatons}
                  colors={[Colors.SeaGreen]}
                  tintColor={Colors.SeaGreen}
                />
              }
            />
          )}
          
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
                <View style={screenStyle.emptyListContainer} >
                  <Text />
                  <ImageBackground
                    source={require("../assets/images/main_logo_v1_500x500.png")}
                    style={screenStyle.emptyImage}
                  />
                  <Text style={screenStyle.text}>{t("friend.norequest")}</Text>
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
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: Colors.Licorice,
      paddingTop: 50,
      paddingHorizontal: 10,
      alignItems: 'center'
  },
  tab: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 30,
      backgroundColor: Colors.Jet,
      borderRadius: 30,
      width: widthPercentageToDP('80%'),
  },
  tabButton: {
      borderRadius: 30,
      width: widthPercentageToDP('35%'),
      paddingVertical: 15,
      backgroundColor: Colors.Onyx
  },
  buttonText: {
      color: Colors.White,
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 16,
  },
  requestContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 5,
      borderBottomWidth: 1,
      borderBottomColor: Colors.Jet,
  },
  buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
  },
  button: {
      backgroundColor: Colors.SeaGreen,
      borderRadius: 30,
      padding: 10,
      marginHorizontal: 5,
  },
  activityContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      gap: 20
  },
});

export default ActivityScreen;
