import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Platform} from "react-native";
import { Colors } from "../../../style/color";
import axiosInstance from "../../../api/axiosInstance";
import ModifyForm from "./ModifyForm";
import { FontAwesome } from "@expo/vector-icons";
import modalStyle from "../../../style/modalStyle";
import { useNavigation } from "@react-navigation/native";

function ModifyProfile({ id }) {
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModify, setModify] = useState(false);

  const checkPseudo = async (pseudo) => {
    try {
      const response = await axiosInstance.get(`/users/isUser?pseudo=${pseudo}`);
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
      const response = await axiosInstance.post("/users/modify", formData, { headers });
      setData((prevData) => ({
        ...prevData,
        user: response.data,
      }));
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
    axiosInstance.get(`/users/${id}/page`, { params: query })
    .then(() => {
      setData(response.data.user);
    }).catch( (e) => {
      console.error(e);
      setError(e.response?.data);
    });
  };

  useEffect(() => {
    updateData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="chevron-left" size={25} color={Colors.Silver} onPress={() => navigation.goBack()} />
        <Text style={modalStyle.modalTitle}></Text>
        <FontAwesome name="pencil" size={25} color={Colors.Silver} onPress={()=> setModify(true)} />      
      </View>
      <ModifyForm
        user={data}
        checkPseudo={checkPseudo}
        handleModify={handleModify}
        isModify={isModify}
        setModify={setModify}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Licorice,
  },
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
    paddingTop: Platform.OS === 'web' ? 25 : 55,
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    borderBottomWidth: 1,
    backgroundColor: 'rgba(43, 43, 43, 0.3)',
    marginBottom: 25,
    borderBottomColor: Colors.Onyx,
  },
  albumContainer: {
    flex: 1,
  },
});

export default ModifyProfile;
