import React, { useEffect, useState } from "react";
import {
  Button,
  View,
  Text,
  Platform,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import commonStyles from "../style/commonStyle";
import axiosInstance from "../api/axiosInstance";
import Profile from "../components/profile/Profile";
import ModifyProfile from "../components/profile/Modify/ModifyProfile";
import Review from "../components/review/Review";
import Item from "../components/artist/Item";
import { breakpoint } from "../style/breakpoint";
import Loader from "../components/common/Loader";
import ErrorRequest from "../components/common/ErrorRequest";
import Tokenizer from "../utils/Tokenizer";

import { StyleSheet, useWindowDimensions } from "react-native";
import { Colors } from "../style/color";
import Loader from "../components/common/Loader";
import Item from "../components/artist/Item";
import ErrorRequest from "../components/common/ErrorRequest";

function ProfileScreen() {
  const [data, setData] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { width } = useWindowDimensions();
  const [isModify, setIsModify] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useAuth();
  const [isFetching, setisFetching] = useState(false);
  const route = useRoute();
  const id = route?.params?.id;
  const [isFinished, setIsFinished] = useState(false);
  const checkPseudo = (pseudo) => {
    return axiosInstance
      .get(`/users/isUser?pseudo=${pseudo}`)
      .then((response) => {
        return !response.data.isUser;
      });
  };
  const handleModify = (formData) => {
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    return axiosInstance
      .post("/users/modify", formData, { headers })
      .then((response) => {
        setData({
          ...data,
          user: response.data,
        });
      });
  };
  const handleFollow = () => {
    return axiosInstance.post("/amis/follow", {
      amiIdUtilisateur: data.user.id_utilisateur,
    });
  };
  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const endOffset = contentSize.height - layoutMeasurement.height;
    const isEnd = contentOffset.y >= endOffset - 50;
    if (isEnd && !isFetching && !isFinished) {
      setisFetching(true);
      getMoreReviews(page + 1).then((nReviews) => {
        if (nReviews && reviews) {
          const new_reviews = [...reviews, ...(nReviews || [])];
          if (new_reviews.length === reviews.length) {
            setIsFinished(true);
          }
          setReviews(new_reviews);
          setisFetching(false);
          setPage(page + 1);
        }
      });
    }
  };
  const getMoreReviews = async (pageNumber) => {
    const query = {
      page: pageNumber,
      pageSize: 20,
      orderByLike: true,
    };
    const queryString = new URLSearchParams(query).toString();
    const id_utilisateur =
      id || (await Tokenizer.getCurrentUser())?.id_utilisateur;
  
    return await axiosInstance
      .get(`/users/${id_utilisateur}/page?${queryString}`)
      .then((response) => {
        return response.data.reviews;
      })
      .catch((e) => {
        setError(e.response.data);
      });
  };
  const style = StyleSheet.create({
    container: {
      height: "100%",
    },
    subcontainer: {
      width: width > breakpoint.medium ? 1200 : "100%",
      paddingLeft: 10,
      paddingRight: 10,
      height: "100%",
    },
    albumContainer: {
      display: "flex",
      flexDirection: "row",

      flexWrap: "wrap",
      justifyContent: "space-around",
    },
    commentContainer: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      marginBottom: 50,
    },
    ScrollViewContainer: {
      width: "100%",
      height: "100%",
    },
    profileContainer: {
      paddingTop: 30,
      paddingBottom: 30,
      position: "sticky",
      top: 0,
      backgroundColor: Colors.Licorice,
      zIndex: 1,
    },
  });
  useEffect(() => {}, [reviews]);
  useEffect(() => {
    const effect = async () => {
      const query = {
        page: page,
        pageSize: 20,
        orderByLike: true,
      };
      const queryString = new URLSearchParams(query).toString();
      const id_utilisateur =
        id || (await Tokenizer.getCurrentUser())?.id_utilisateur;
      axiosInstance
        .get(`/users/${id_utilisateur}/page?${queryString}`)
        .then((response) => {
          setReviews(response.data.reviews);
          setData(response.data);
          setIsLoading(false);
        })
        .catch((e) => {
          setError(e.response.data);
        });
    };
    effect();
  }, []);
  if (error) {
    return <ErrorRequest err={error} />;
  }
  return isLoading ? (
    <Loader />
  ) : (
    <SafeAreaView style={[commonStyles.safeAreaContainer, style.container]}>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={style.ScrollViewContainer}
      >
        <View style={{ width: "100%", display: "flex", alignItems: "center" }}>
          <View style={[style.subcontainer]}>
            <View style={style.profileContainer}>
              <Profile
                user={data.user}
                isCurrent={data.isCurrent}
                relation={data.relation}
                handleModifier={() => setIsModify(true)}
                handleFollow={handleFollow}
              ></Profile>
            </View>
            {data.forbidden ? (
              <Text>Accès interdit</Text>
            ) : (
              <ScrollView style={style.ScrollViewContainer}>
                {Platform.OS !== "web" ? (
                  <ScrollView horizontal>
                    {data?.oeuvres
                      ? data.oeuvres.map((item, index) => (
                          <Item key={index} data={item} />
                        ))
                      : null}
                  </ScrollView>
                ) : (
                  <View style={[style.albumContainer]}>
                    {data?.oeuvres
                      ? data.oeuvres.map((item, index) => (
                          <Item key={index} data={item} />
                        ))
                      : null}
                  </View>
                )}
                <View style={style.commentContainer}>
                  {reviews
                    ? reviews.map((item, index) => (
                        <Review key={index} data={item} />
                      ))
                    : null}
                  {isFetching ? <Loader /> : null}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </ScrollView>

      {isModify ? (
        <ModifyProfile
          user={data.user}
          checkPseudo={checkPseudo}
          handleModify={handleModify}
          handleQuit={() => setIsModify(false)}
          handleLogout={logout}
          handleResetEmail={() => {}}
          handleResetPassword={() => {}}
        ></ModifyProfile>
      ) : null}
    </SafeAreaView>
  );
}

export default ProfileScreen;
