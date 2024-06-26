import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  Image,
  FlatList,
  RefreshControl,
  Pressable,
  Animated,
  ImageBackground,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import axiosInstance from "../api/axiosInstance";
import Profile from "../components/profile/Profile";
import ModifyProfile from "../components/profile/Modify/ModifyProfile";
import Review from "../components/review/Review";
import Item from "../components/artist/Item";
import { breakpoint } from "../style/breakpoint";
import Tokenizer from "../utils/Tokenizer";
import { Colors } from "../style/color";
import Loader from "../components/common/Loader";
import NavBar from "../components/profile/NavBar";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import commonStyles from "../style/commonStyle";
import screenStyle from "../style/screenStyle";

const ProfileScreen = () => {
  const windowDimensions = useWindowDimensions();
  const width = windowDimensions ? windowDimensions.width : 0;

  const [data, setData] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [favoris, setFavoris] = useState([]);
  const [followed, setFollowed] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModify, setIsModify] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState("posts");
  const [currentUser, setCurrentUser] = useState({});
  const [isModifierHovered, setIsModifierHovered] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const route = useRoute();
  const id = route.params?.id || null;
  const navigation = useNavigation();

  const getData = async () => {
    const user = await Tokenizer.getCurrentUser();
    setCurrentUser(user);
    return user;
  };

  const updateData = (user) => {
    const query = {
      page: page,
      pageSize: 20,
      orderByLike: true,
    };
    const id_utilisateur = id || currentUser?.id_utilisateur || user?.id_utilisateur;
    axiosInstance
      .get(`/users/${id_utilisateur}/page`, { params: query })
      .then((response) => {
        setData(response.data);
        const newReviews = response.data.reviews || [];
        setReviews((prev) => [...prev, ...newReviews]);
        setFavoris(response.data.oeuvres);
        setFollowed(response.data.allFollowed);
        setFollowers(response.data.followers);
        setHasMore(response.data.reviewsCount > reviews.length);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.response?.data || error.message);
        setIsLoading(false);
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const refreshData = async () => {
      await getData().then((user) => {
        updateData(user);
      });
    };
    refreshData();
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const handleFollow = () => {
    const url = data.relation.isFollowed ? "/amis/unfollow" : "/amis/follow";
    axiosInstance
      .post(url, { amiIdUtilisateur: data.user.id_utilisateur })
      .then(() => {
        const successMessage = data.relation.isFollowed
          ? "✅  Vous êtes désabonné à cet utilisateur."
          : "✅  Vous êtes abonné à cet utilisateur.";
        Toast.show({
          type: "success",
          text1: successMessage,
          text1Style: { color: Colors.White },
          position: "bottom",
        });
        updateData();
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "❌  Une erreur interne est survenue.",
          text1Style: { color: Colors.White },
          position: "bottom",
        });
      });
  };

  const loadMoreReviews = () => {
    if (hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await getData().then((user) => {
          updateData(user);
        });
      };
      fetchData();
    }, [])
  );

  return isLoading ? (
    <Loader />
  ) : (
    <View style={screenStyle.container}>
      <Animated.View style={styles.header}>
        <View style={styles.headerContent}>
          <FontAwesome
            name="chevron-left"
            size={20}
            color={Colors.Silver}
            onPress={() => navigation.goBack()}
            style={styles.chevronIcon}
          />
          <View style={styles.headerCenter}>
            <Text />
          </View>
          {data?.isCurrent ? (
            <Pressable
              style={[
                commonStyles.text,
                styles.ModifierButton,
                isModifierHovered ? styles.btnModifierHovered : null,
              ]}
              onPress={() =>
                navigation.navigate("setting", {
                  id: id || currentUser.id_utilisateur,
                })
              }
              onPressIn={() => setIsModifierHovered(true)}
              onPressOut={() => setIsModifierHovered(false)}
            >
              <FontAwesome name="gear" color={Colors.Silver} size={25} />
            </Pressable>
          ) : (
            <Text />
          )}
        </View>
        <Profile
          user={data.user}
          isCurrent={data.isCurrent}
          relation={data.relation}
          handleFollow={handleFollow}
          followers={followers}
          followed={followed}
          onRefresh={updateData}
        />
        <NavBar setTab={setTab} />
      </Animated.View>
      <View
        style={styles.subcontainer}
      >
        {data.forbidden && !data.isCurrent ? (
          <ForbiddenContent />
        ) : (
          <>
            {tab === "fav" && (
              <FlatList
                data={favoris}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => <Item data={item} />}
                contentContainerStyle={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
                ListEmptyComponent={<EmptyList />}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[Colors.SeaGreen]}
                    tintColor={Colors.SeaGreen}
                  />
                }
                horizontal={Platform.OS === "web"}
                showsHorizontalScrollIndicator={false}
              />
            )}
            {tab === "posts" && (
              <FlatList
                data={reviews}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Review data={item} />}
                contentContainerStyle={{
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
                onEndReached={loadMoreReviews}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={<EmptyList />}
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
      {isModify && <ModifyProfile id={data} />}
    </View>
  );
};

const ForbiddenContent = () => (
  <View style={styles.forbiddenContainer}>
    <Text />
    <FontAwesome5
      name="lock"
      color={Colors.SeaGreen}
      size={160}
      style={{ opacity: 0.5 }}
    />
    <Text style={styles.text}>
      Abonnez-vous à cet utilisateur pour pouvoir voir ses critiques.
    </Text>
  </View>
);

const EmptyList = () => (
  <View style={styles.emptyListContainer}>
    <Text />
    <ImageBackground
      source={require("../assets/images/main_logo_v1_500x500.png")}
      style={screenStyle.emptyImage}
    />
    <Text />
  </View>
);

const styles = StyleSheet.create({
  subcontainer: {
    marginTop: 30,
    flex: 1
  },
  albumContainer: {
    alignItems: "center",
    justifyContent: "space-around",
  },
  commentContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  profileContainer: {
    paddingTop: 30,
    paddingBottom: 30,
    position: "sticky",
    top: 0,
    backgroundColor: Colors.Licorice,
    zIndex: 1,
  },
  text: {
    fontSize: Platform.OS === "web" ? 20 : 16,
    color: Colors.Celadon,
    marginBottom: 10,
    padding: 10,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  ModifierButton: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 10,
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    transition: "background-color 0.3s ease",
  },
  header: {
    justifyContent: "space-around",
    paddingTop: Platform.OS !== "web" ? 30 : 0,
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: "rgba(43, 43, 43, 0.3)",
  },
  title: {
    fontSize: Platform.OS === "web" ? 25 : 20,
    color: Colors.Silver,
    fontWeight: "bold",
    paddingTop: 15,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'baseline',
    paddingLeft: 5,
    padding: 10,
    marginBottom: 10
  },
  chevronIcon: {
    paddingLeft: 15,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  forbiddenContainer: {
    alignContent: "space-around",
    gap: 55,
    alignItems: "center",
  },
  emptyListContainer: {
    alignContent: "space-around",
    gap: 55,
    alignItems: "center",
  },
  btnModifierHovered: {
    backgroundColor: Colors.SeaGreen,
  },
});

export default ProfileScreen;
