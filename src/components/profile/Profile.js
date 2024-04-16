import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  Platform,
  Pressable,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Colors } from "../../style/color";
import { breakpoint } from "../../style/breakpoint";
import PressableBasic from "../pressables/PressableBasic";
import commonStyles from "../../style/commonStyle";

function SearchBar({ user, isCurrent, handleFollow, handleModifier }) {
  const { height, width } = useWindowDimensions();
  const [isFollowHovered, setIsFollowHovered] = useState(false);
  const [isModifierHovered, setIsModifierHovered] = useState(false);
  const getButtonText = () => {
    // if(relation.are)
  };
  useEffect(() => {
    console.log(user);
  }, [user]);
  const handleFollowMouseEnter = () => {
    setIsFollowHovered(true);
  };

  const handleFollowMouseLeave = () => {
    setIsFollowHovered(false);
  };

  const handleModifierMouseEnter = () => {
    setIsModifierHovered(true);
  };

  const handleModifierMouseLeave = () => {
    setIsModifierHovered(false);
  };
  const styles = StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      gap: 10,
      alignItems: "center",
    },
    diplayContainer: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
    },
    image: {
      width: width < breakpoint.medium ? 70 : 80,
      height: width < breakpoint.medium ? 70 : 80,
      borderRadius: width < breakpoint.medium ? 35 : 40,
    },
    imageContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },

    infoContainer: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: "100%",
    },
    numberContainer: {
      paddingTop: 10,
      display: "flex",
      flexDirection: "row",
      width: "100%",
      justifyContent:
        width < breakpoint.mobile ? "space-between" : "space-around",
    },
    followText: {
      fontWeight: "600",
      textAlign: "center",
      color: Colors.Silver,
    },
    followButton: {
      backgroundColor: Colors.Onyx,
      paddingVertical: 2,
      paddingHorizontal: 10,
      borderRadius: 20,
      marginTop: 10,
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      transition: "background-color 0.3s ease",
    },
    ModifierButton: {
      backgroundColor: Colors.BattleShipGray,
      paddingVertical: 2,
      paddingHorizontal: 10,
      borderRadius: 20,
      marginTop: 10,
      color: "#FFFFFF",
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      transition: "background-color 0.3s ease",
    },
    btnFollowHovered: {
      backgroundColor: Colors.Jet,
    },
    btnModiferHovered: {
      backgroundColor: Colors.SeaGreen,
    },
    aliasText: {
      fontSize: 35,
      fontWeight: "500",
      color: Colors.Celadon,
    },
    pseudoText: {
      color: Colors.CalPolyGreen,
      fontSize: 12,
      fontWeight: "600",
    },
    numberText: {
      fontSize: 12,
      color: Colors.Silver,
    },
    reviewText: {
      // display: width < 300 ? "none" : "block",
    },
    numberValue: {
      fontWeight: "bold",
    },
    bioText: {
      color: Colors.Silver,
    },
  });

  return (
    <View style={[styles.container]}>
      <View style={[styles.imageContainer]}>
        <Image
          style={styles.image}
          source={{
            uri:
              user?.photo ||
              "https://merriam-webster.com/assets/mw/images/article/art-wap-article-main/egg-3442-e1f6463624338504cd021bf23aef8441@1x.jpg",
          }}
        />
        {isCurrent ? null : (
          <Pressable
            style={[
              commonStyles.text,
              styles.followButton,
              isFollowHovered ? styles.btnFollowHovered : null,
            ]}
            activeOpacity={1}
            onMouseEnter={handleFollowMouseEnter}
            onMouseLeave={handleFollowMouseLeave}
            onPress={handleFollow}
          >
            {!false ? (
              <Text style={[commonStyles.text, styles.followText]}>
                + Suivre
              </Text>
            ) : (
              <Text style={[commonStyles.text, styles.followText]}>Suivi</Text>
            )}
          </Pressable>
        )}
      </View>
      <View style={[styles.infoContainer]}>
        <View>
          <View style={[styles.diplayContainer]}>
            <Text style={[commonStyles.text, styles.aliasText]}>
              {user?.alias}
            </Text>
            <Pressable
              style={[
                commonStyles.text,
                styles.ModifierButton,
                isModifierHovered ? styles.btnModiferHovered : null,
              ]}
              activeOpacity={1}
              onMouseEnter={handleModifierMouseEnter}
              onMouseLeave={handleModifierMouseLeave}
              onPress={handleModifier}
            >
              <Text>modifer</Text>
            </Pressable>
          </View>
          <Text style={[commonStyles.text, styles.pseudoText]}>
            @{user?.pseudo}
          </Text>
          <Text style={[commonStyles.text, styles.bioText]}>{user?.bio}</Text>
        </View>

        <View style={[styles.numberContainer]}>
          <Text
            style={[commonStyles.text, styles.numberText, styles.reviewText]}
          >
            <Text style={[styles.numberValue]}>{user?.review_count}</Text>{" "}
            <Text style={[styles.numberLabel]}>reviews</Text>
          </Text>
          <Text style={[commonStyles.text, styles.numberText]}>
            <Text style={[styles.numberValue]}>{user?.follower_count}</Text>{" "}
            <Text style={[styles.numberLabel]}>followers</Text>
          </Text>
          <Text style={[commonStyles.text, styles.numberText]}>
            <Text style={[styles.numberValue]}>{user?.following_count}</Text>{" "}
            <Text style={[styles.numberLabel]}>suivi(e)s</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

export default SearchBar;
