import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Avatar, Divider } from "react-native-paper";
import axiosInstance from "../api/axiosInstance";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Tokenizer from "../utils/Tokenizer";
import Loader from "../components/common/Loader";
import Review from "../components/review/Review";
import { Colors } from "../style/color";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import screenStyle from "../style/screenStyle";

const baseImageURL =
  "https://merriam-webster.com/assets/mw/images/article/art-wap-article-main/egg-3442-e1f6463624338504cd021bf23aef8441@1x.jpg";

const HomeScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setUser] = useState({});
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { checkLogin } = useAuth();
  checkLogin(navigation);
  const getData = async () => {
    setUser(await Tokenizer.getCurrentUser());
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData();
    setPage(1); // Remise à zéro de la pagination
    setReviews([]); // Remise à zéro des reviews
    updateReviews();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const updateReviews = () => {
    if (isLoading) return;
    setIsLoading(true);
    axiosInstance
      .get("/review/timeline", {
        params: { page: page, pageSize: 50, orderByLike: false },
      })
      .then((response) => {
        setReviews((prevReviews) => [...prevReviews, ...response.data.reviews]);
        setHasMore(response.data.count > reviews.length);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error("Erreur lors de la récupération des reviews:", e?.response?.data?.message);
        setIsLoading(false);
        setError(e?.response?.data?.message);
      });
  };

  const loadMoreReviews = () => {
    if (hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return <Loader />;
  };

  useFocusEffect(
    useCallback(() => {
      getData();
      updateReviews();
    }, [])
  );

  return (
    <View style={screenStyle.container}>
       {Platform.OS !== 'web' && (
      <View style={screenStyle.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../assets/images/main_logo_no_bg.png")}
            style={{ width: 45, height: 45, borderRadius: 5 }}
          />
          <Text style={styles.name}>{t("common.solimbo")}</Text>
        </View>
        <Pressable
          onPress={() => {
            setPage(1);
            setReviews([]);
            navigation.navigate("Profile");
          }}
        >
          <Avatar.Image
            source={{ uri: currentUser?.photo || baseImageURL }}
            size={Platform.OS === "web" ? 65 : 45}
            accessibilityLabel={currentUser?.pseudo}
          />
        </Pressable>
      </View>
      )}
      <FlatList
        data={reviews}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
            <Review data={item} />
        )}
        onEndReached={loadMoreReviews}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'flex-start',
      }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.SeaGreen]}
            tintColor={Colors.SeaGreen}
          />
        }
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={screenStyle.emptyImage}>
            <Text />
            <ImageBackground
              source={require("../assets/images/main_logo_v1_500x500.png")}
              style={{ width: 165, height: 165, opacity: 0.3 }}
            />
            {!isLoading ? (
              <Text style={styles.text}>{t("review.subscribeinvitation")}</Text>
            ) : null}
          </View>
        }
        showsVerticalScrollIndicator={false}
        style={{ paddingTop: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  name: {
    fontSize: Platform.OS === "web" ? 30 : 20,
    color: Colors.Celadon,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "uppercase",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default HomeScreen;
