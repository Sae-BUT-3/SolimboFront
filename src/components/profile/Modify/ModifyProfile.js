import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Platform, ScrollView } from "react-native";
import { Colors } from "../../../style/color";
import axiosInstance from "../../../api/axiosInstance";
import ModifyForm from "./ModifyForm";
import { FontAwesome } from "@expo/vector-icons";
import modalStyle from "../../../style/modalStyle";
import { useNavigation, useRoute } from "@react-navigation/native";
import screenStyle from "../../../style/screenStyle";
function ModifyProfile({}) {
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModify, setModify] = useState(false);
  const route = useRoute();
  const id = route.params?.id || null;
  const checkPseudo = async (pseudo) => {
    try {
      const response = await axiosInstance.get(
        `/users/isUser?pseudo=${pseudo}`
      );
      return !response.data.isUser;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleModify = async (formData) => {
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    try {
      const response = await axiosInstance.post("/users/modify", formData, {
        headers,
      });
      setData(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const updateData = async () => {
    setIsLoading(true);
    const query = {
      page: 1,
      pageSize: 20,
      orderByLike: true,
    };
    axiosInstance
      .get(`/users/${id}/page`, { params: query })
      .then((response) => {
        setData(response.data.user);
      })
      .catch((e) => {
        console.error(e);
        setError(e.response?.data);
      });
  };

  useEffect(() => {
    updateData();
  }, []);

  return (
    <View style={screenStyle.container}>
      <View style={screenStyle.header}>
        <FontAwesome
          name="chevron-left"
          size={25}
          color={Colors.Silver}
          onPress={() => navigation.goBack()}
        />
        <Text style={modalStyle.modalTitle}></Text>
        <FontAwesome
          name="pencil"
          size={25}
          color={Colors.Silver}
          onPress={() => setModify(true)}
        />
      </View>
      <ScrollView style={{ height: 100 }}>
        <ModifyForm
          user={data}
          checkPseudo={checkPseudo}
          handleModify={handleModify}
          isModify={isModify}
          setModify={setModify}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: Colors.White,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.Onyx,
    marginBottom: 15,
  },
  albumContainer: {
    flex: 1,
  },
});

export default ModifyProfile;
