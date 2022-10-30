import { View, Text, SafeAreaView } from "react-native";
import React from "react";

import { safeArea } from "../styles";
import ChatHeader from "../components/ChatHeader";
import ChatList from "../components/ChatList";

const ChatScreen = () => {
  return (
    <SafeAreaView style={safeArea}>
      <ChatHeader title="Chat" />
      <ChatList />
    </SafeAreaView>
  );
};

export default ChatScreen;
