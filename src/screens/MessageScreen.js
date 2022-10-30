/**
 * Note:
 * We can use KeyboardAvoidingView to make the components render upwards according to the keyboard size so that the component wont be hidden due to keyboard
 * We can use TouchableWithoutFeedback to implement feature like when pressed at other places, the keyboard will just be disabled/removed
 */

import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useTailwind } from "tailwind-rn";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import ChatHeader from "../components/ChatHeader";
import { safeArea } from "../styles";
import useAuth from "../hooks/useAuth";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import SenderMessage from "../components/SenderMessage";
import ReceiverMessage from "../components/ReceiverMessage";
import { db } from "../../firebase";

const MessageScreen = () => {
  const { user } = useAuth();
  const tw = useTailwind();

  //remember: when navigation use useRoute() and when <Component props=value />, then only pass it as props above
  const { params } = useRoute();
  const { matchDetails } = params;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", matchDetails.id, "messages"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      ),
    [matchDetails, db]
  );

  //we will be storing all the messages by creating a new collection inside the matches collection
  const sendMessage = () => {
    addDoc(collection(db, "matches", matchDetails.id, "messages"), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: user.displayName,
      //the photo url is in matches/<a user:there are two users>/photURL
      photoURL: matchDetails.users[user.uid].photoURL,
      message: input,
    });

    setInput("");
  };

  return (
    <SafeAreaView style={[safeArea, tw("flex-1")]}>
      <ChatHeader
        title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName}
        callEnabled
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw("flex-1")}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            data={messages}
            inverted={-1}
            style={tw("pl-4")}
            keyExtractor={(item) => item.id}
            //this renderItem must have a prop with name item. Here, we have changed its name to message
            renderItem={({ item: message }) =>
              message.userId === user.uid ? (
                <SenderMessage key={message.id} message={message} />
              ) : (
                <ReceiverMessage key={message.id} message={message} />
              )
            }
          />
        </TouchableWithoutFeedback>
        <View
          style={tw(
            "flex-row justify-between items-center border-t border-gray-200 px-5 py-2"
          )}
        >
          <View style={tw("w-[80%] border border-gray-300")}>
            <TextInput
              multiline
              style={tw("h-10 text-lg pl-2")}
              placeholder="Send Message..."
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
              value={input}
            />
          </View>
          <Button onPress={sendMessage} title="Send" color="#FF5864" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageScreen;
