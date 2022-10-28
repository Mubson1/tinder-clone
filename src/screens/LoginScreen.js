import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import React, { useLayoutEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { useTailwind } from "tailwind-rn";

const LoginScreen = () => {
  const tw = useTailwind();

  const { signInWithGoogle, loading } = useAuth();
  const navigation = useNavigation();

  //when using stackNavigator, the name of the screen will be displayed at the head. To disable it:
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerShown: false,
  //   });
  // });

  return (
    <View style={tw("flex-1")}>
      <ImageBackground
        resizeMode="cover"
        style={tw("flex-1")}
        source={{ uri: "https://tinder.com/static/tinder.png" }}
      >
        <TouchableOpacity
          onPress={signInWithGoogle}
          style={tw(
            "absolute bottom-40 w-52 bg-white rounded-2xl mx-[25%] py-4"
          )}
        >
          <Text style={tw("text-center")}>Sign in & get swiping</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
