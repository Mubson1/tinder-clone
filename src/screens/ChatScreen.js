import { View, Text, SafeAreaView } from "react-native";
import React from "react";

import { safeArea } from "../styles";

const ChatScreen = () => {
  return (
    <SafeAreaView style={safeArea}>
      <View>
        <Text>ChatScreen</Text>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
