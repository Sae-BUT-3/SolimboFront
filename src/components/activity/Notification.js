import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Platform } from 'react-native';
import { Colors } from "../../style/color";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("fr-FR", options);
};

const Notification = ({ data }) => {
    const { t } = useTranslation();
    const navigation = useNavigation();

    const [multipleSender, setMultipleSender] = useState(data.sender.length > 1);   
    const [timestampFormated, setTimestampFormated] = useState(formatDate(data.createdAt));
    const [includeReviewPreview, setIncludeReviewPreview] = useState(data.type === "reply");
    const [textNotification, setTextNotification] = useState("");

    const typeEnumIcon = {
        "like": "heart",
        "reply": "comment",
        "follow": "user-plus",
    }

    const typeEnumText = {
        "likeReview": multipleSender ? t("notification.andManyOthers", { count: data.sender.length }) + t("notification.likeReviewMultiple", { reviewName: data?.review?.oeuvre?.name }) : t("notification.likeReviewSingle", { reviewName: data?.review?.oeuvre?.name }),
        "replyReview": multipleSender ? t("notification.andManyOthers", { count: data.sender.length }) + t("notification.replyReviewMultiple", { reviewName: data?.review?.oeuvre?.name }) : t("notification.replyReviewSingle", { reviewName: data?.review?.oeuvre?.name }),
        "likeComment": multipleSender ? t("notification.andManyOthers", { count: data.sender.length }) + t("notification.likeCommentMultiple") : t("notification.likeCommentSingle"),
        "replyComment": multipleSender ? t("notification.andManyOthers", { count: data.sender.length }) + t("notification.replyCommentMultiple") : t("notification.replyCommentSingle"),
        "follow": multipleSender ? t("notification.andManyOthers", { count: data.sender.length }) + t("notification.followMultiple") : t("notification.followSingle"),
    }

    useEffect(() => {
        switch (data.type) {
            case "follow":
                setTextNotification(typeEnumText[data.type]);
                break;
            case "like":
                if (data.review) {
                    setTextNotification(typeEnumText["likeReview"]);
                } else {
                    setTextNotification(typeEnumText["likeComment"]);
                }
                break;
            case "reply":
                if (data.review) {
                    setTextNotification(typeEnumText["replyReview"]);
                } else {
                    setTextNotification(typeEnumText["replyComment"]);
                }
                break;
            default:
                setTextNotification("");
        }
    }, [data]);

    const handlePress = () => {
        if (data.type === "follow") {
            navigation.navigate("user", { id: data.sender[0].id_utilisateur });
        } else if (data.type === "like" || data.type === "reply") {
            if (data.review) {
                navigation.navigate("comment", { id: data.review.id_review });
            }
            if (data.comment) {
                navigation.navigate("comment", { id: data.comment.id_review });
            }
        }
    }

    return (
        <Pressable style={[styles.container, data?.is_old && styles.isOld]} onPress={handlePress}>
            <View style={styles.header}>
                <View style={styles.leftHeader}>
                    <FontAwesome5 name={typeEnumIcon[data.type]} size={24} color={Colors.CalPolyGreen} style={styles.iconHeader} solid/>
                    {data.sender.slice(0, 5).map((sender, index) => (
                        <View key={index} style={styles.sender}>
                            <Image
                                source={{ uri: sender.photo }}
                                style={styles.image}
                            />
                        </View>
                    ))}
                </View>
                <Text style={styles.date}>{timestampFormated}</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.text}>
                    <Text style={styles.senderName} > {data.sender[0].pseudo} </Text> 
                    {textNotification}
                </Text>
            </View>
            {includeReviewPreview && (data?.reply?.description ) && (
                <View style={styles.footer}>
                    <Text style={styles.text}>{data?.reply?.description}</Text>
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Jet,
        padding: 5,
        borderRadius: 10,
    },
    isOld: {
        opacity: 0.5,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingTop: 15,
        position: "relative",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: "rgba(43, 43, 43, 0.5)",
    },
    leftHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconHeader: {
        marginRight: 10,
    },
    text: {
        fontSize: Platform.OS === "web" ? 20 : 16,
        color: Colors.GreyWhite,
        textAlign: "left",
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    sender: {
        flexDirection: "row",
        alignItems: "center",
    },
    senderName: {
        color: Colors.Celadon,
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 25,
        marginRight: 7,
    },
    date: {
        color: Colors.GreyWhite,
        fontSize: 16,
    },
    content: {
        padding: 10,
    },
    footer: {
        backgroundColor: Colors.Onyx,
        padding: 10,
        margin: 10,
        borderRadius: 10,
        paddingBottom: 15,
    },
});

export default Notification;