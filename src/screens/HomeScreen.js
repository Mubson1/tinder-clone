import {
  View,
  Text,
  Button,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React, { useRef } from "react";
import { useTailwind } from "tailwind-rn/dist";
import { useNavigation } from "@react-navigation/native";
import Swiper from "react-native-deck-swiper";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";

import useAuth from "../hooks/useAuth";
import { safeArea } from "../styles";
import Header from "../components/Header";
import { DUMMY_DATA } from "../../data";
import CardSwipe from "../components/CardSwipe";

const HomeScreen = () => {
  const tw = useTailwind();

  const { user, logout } = useAuth();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[tw("flex-1"), safeArea]}>
      <Header />
      <CardSwipe />
    </SafeAreaView>
  );
};

export default HomeScreen;
