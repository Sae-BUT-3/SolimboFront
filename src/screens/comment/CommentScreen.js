import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Animated,
  Platform,
  RefreshControl,
  FlatList,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons"; // Importation de FontAwesome5
import { Colors } from "../../style/color";
import Comment from "../../components/comment/Comment";
import axiosInstance from "../../api/axiosInstance";
import Review from "../../components/review/Review";
import ErrorRequest from "../../components/common/ErrorRequest";
import Loader from "../../components/common/Loader";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import i18next from "i18next";
import { getDeeplLangAttribute } from "../../utils/DeepLangAttribute";

const CommentScreen = () => {
  const route = useRoute();
  const id = route.params?.id || null;
  const navigation = useNavigation();
  const { checkLogin } = useAuth();
  checkLogin(navigation);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [review, setReview] = useState({});
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(0);
    loadComments(0, true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadComments(0, true);
    }, [])
  );

  const loadComments = (newPage, reset = false) => {
    if (!reset) {
      setIsLoadingMore(true);
    }
    axiosInstance
      .get(`/review/${id}`, {
        params: { page: newPage + 1, pageSize: 100, orderByLike: false, lang: getDeeplLangAttribute(i18next.language) },
      })
      .then((response) => {
        setReview(response.data);
        setComments(
          reset
            ? response.data.comments
            : [...comments, ...response.data.comments]
        );
        setCount(response.data.countComment);
        setIsLoading(false);
        setIsLoadingMore(false);
        setRefreshing(false);
      })
      .catch((e) => {
        setError(e.response.data);
        setIsLoading(false);
        setIsLoadingMore(false);
        setRefreshing(false);
      });
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && comments.length < count && comments.length > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadComments(nextPage);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [
      "rgba(255, 255, 255, 0)",
      "rgba(255, 255, 255, 1)",
      "rgba(64, 64, 64, 1)",
    ],
    extrapolate: "clamp",
  });

  const handleResponse = () => {
    navigation.navigate("response", { type: "review", id: id });
  };

  if (error) {
    return <ErrorRequest err={error} />;
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Animated.View>
            <View style={[styles.header, headerOpacity]}>
              <Pressable onPress={handleGoBack}>
                <FontAwesome5
                  name="chevron-left"
                  size={25}
                  color={Colors.White}
                  style={{ paddingTop: 15 }}
                />
              </Pressable>
              <Text style={styles.title}>{t("comment.plurialtitle")}</Text>
              <Text />
            </View>
          </Animated.View>
          <FlatList
            data={comments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Comment data={item} hide={false} />
              </View>
            )}
            ListHeaderComponent={
              <View
                style={[
                  styles.itemContainer,
                  {
                    marginBottom: 20,
                    borderBottomColor: Colors.Onyx,
                    borderBottomWidth: 1,
                  },
                ]}
              >
                <Review data={review} />
              </View>
            }
            ListEmptyComponent={
              <Text
                style={{
                  color: Colors.White,
                  fontSize: 20,
                  textAlign: "center",
                  marginTop: 30,
                }}
              >
                Aucun commentaire, soyez le premier à rédiger un commentaire !
              </Text>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.DarkSpringGreen]}
                tintColor={Colors.DarkSpringGreen}
                size="large"
                title={t("common.refreshing")}
                titleColor={Colors.White}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isLoadingMore ? <Loader /> : null}
          />
          <View style={styles.response}>
            <Pressable onPress={handleResponse}>
              <FontAwesome5
                name="comment-medical"
                size={30}
                color={Colors.DarkSpringGreen}
                regular
              />
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Licorice,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: 30,
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: "rgba(43, 43, 43, 0.3)",
    marginBottom: 30,
  },
  title: {
    fontSize: Platform.OS === "web" ? 35 : 25,
    color: Colors.White,
    fontWeight: "bold",
    paddingTop: 15,
  },
  response: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    left: 20,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(43, 43, 43, 0.5)",
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 10,
  },
  itemContainer: {
    width: "100%",
    alignItems: "center",
  },
});

export default CommentScreen;
