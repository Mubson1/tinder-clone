import { SafeAreaView } from "react-native";
import React from "react";
import { useTailwind } from "tailwind-rn/dist";
import { useNavigation } from "@react-navigation/native";

import useAuth from "../hooks/useAuth";
import { safeArea } from "../styles";
import Header from "../components/Header";
import CardSwipe from "../components/CardSwipe";

const HomeScreen = () => {
  const tw = useTailwind();

  return (
    <SafeAreaView style={[tw("flex-1"), safeArea]}>
      <Header />
      <CardSwipe />
    </SafeAreaView>
  );
};

export default HomeScreen;
