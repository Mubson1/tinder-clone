import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTailwind } from "tailwind-rn";

import useAuth from "../hooks/useAuth";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import { styles } from "../styles";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";

const ChatRow = ({ matchDetails }) => {
  //matchDetails contains two objects: 'users' and 'usersMatched'. Users contains all the details of both person who have matched and usersMatched contains just the two ids in an array
  //since the matchDetails contains details of both users, but in the chat screen, I want to be able to see the details of the other person who I want to chat.
  //Thus, to separate the other person from our matchDetails, we will build a helper function - getMatchedUserInfo

  const tw = useTailwind();
  const navigation = useNavigation();
  const { user } = useAuth();

  const [matchedUserInfo, setMatchedUserInfo] = useState(null);
  const [lastMessage, setLastMessage] = useState("");

  //this useEffect will be responsible for removing my details from the matchDetails
  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
  }, [matchDetails, user]);

  //this useEffect will be responsible for getting the last messages
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", matchDetails.id, "messages"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setLastMessage(snapshot?.docs[0].data())
      ),
    [matchDetails, db]
  );
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Message", {
          matchDetails,
        })
      }
      style={[
        tw("flex-row items-center py-3 px-5 bg-white mx-3"),
        styles.cardShadow,
      ]}
    >
      <Image
        style={tw("rounded-full h-16 w-16 mr-4")}
        source={{ uri: matchedUserInfo?.photoURL }}
      />
      <View>
        <Text style={tw("text-lg font-semibold")}>
          {matchedUserInfo?.displayName}
        </Text>
        <View style={tw("flex-row")}>
          {lastMessage ? (
            <>
              {lastMessage.userId === user.uid && <Text>You: </Text>}
              <Text>{lastMessage.message}</Text>
            </>
          ) : (
            <Text>Say Hi</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRow;
