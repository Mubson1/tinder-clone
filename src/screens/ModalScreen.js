import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useTailwind } from "tailwind-rn";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

import { safeArea } from "../styles";
import useAuth from "../hooks/useAuth";
import { db } from "../../firebase";

const ModalScreen = () => {
  const tw = useTailwind();

  const navigation = useNavigation();
  const { user } = useAuth();

  const [image, setImage] = useState(null);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);

  const incompleteForm = !image || !job || !age;

  const updateUserProfile = () => {
    //doc references the firebase document, db is what we initialized in firebase.js, users is the name of the collection, user.uid is like a key
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image,
      job: job,
      age: age,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw("flex-1")}
      keyboardVerticalOffset={10}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[tw("flex-1 items-center pt-1"), safeArea]}>
          <Image
            style={tw("h-20 w-full")}
            resizeMode="contain"
            source={{ uri: "https://links.papareact.com/2pf" }}
          />

          <Text style={tw("text-xl text-gray-500 p-2 font-bold mt-4")}>
            Welcome {user.displayName}
          </Text>
          <ScrollView
            contentContainerStyle={tw("items-center")}
            style={tw("w-full mt-14")}
          >
            <Text style={tw("text-center p-4 font-bold text-red-400")}>
              Step 1: The Profile Pic
            </Text>
            <TextInput
              value={image}
              onChangeText={setImage}
              style={tw("text-center text-xl pb-2")}
              placeholder="Enter a Profile Pic URL"
            />

            <Text style={tw("text-center p-4 font-bold text-red-400")}>
              Step 2: The Job
            </Text>
            <TextInput
              value={job}
              onChangeText={setJob}
              style={tw("text-center text-xl pb-2")}
              placeholder="Enter your Occupation"
            />

            <Text style={tw("text-center p-4 font-bold text-red-400")}>
              Step 3: The Age
            </Text>
            <TextInput
              value={age}
              onChangeText={setAge}
              style={tw("text-center text-xl pb-2")}
              placeholder="Enter your Age"
              keyboardType="numeric"
              maxLength={2}
            />
            <TouchableOpacity
              disabled={incompleteForm}
              onPress={updateUserProfile}
              style={[
                tw("w-64 p-3 rounded-xl mt-14"),
                incompleteForm ? tw("bg-gray-400") : tw("bg-red-400"),
              ]}
            >
              <Text style={tw("text-center text-white text-xl")}>
                Update Profile
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ModalScreen;
