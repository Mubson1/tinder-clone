import { View, Text, Button } from "react-native";
import React from "react";
import { useTailwind } from "tailwind-rn/dist";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const tw = useTailwind();

  const navigation = useNavigation();
  return (
    <View style={tw("")}>
      <Text>Home screen</Text>
      <Button
        title="Go to Chat Screen"
        onPress={() => navigation.navigate("Chat")}
      />
    </View>
  );
};

export default HomeScreen;
