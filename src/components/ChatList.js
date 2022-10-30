import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useTailwind } from "tailwind-rn";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { db } from "../../firebase";
import useAuth from "../hooks/useAuth";
import ChatRow from "./ChatRow";

const ChatList = () => {
  const tw = useTailwind();

  const { user } = useAuth();
  const [matches, setMatches] = useState([]);

  useEffect(
    () =>
      //our matches collection is such that it is contains two objects: 'users' and 'usersMatched'. Users contains all the details of both person who have matched and usersMatched contains just the two ids in an array
      onSnapshot(
        query(
          collection(db, "matches"),
          where("usersMatched", "array-contains", user.uid)
        ),
        (snapshot) =>
          setMatches(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      ),
    [user]
  );
  return matches.length > 0 ? (
    <FlatList
      style={tw("h-full")}
      data={matches}
      keyExtractor={(item) => item.id}
      //here the destructured props must be "ITEM"
      renderItem={({ item }) => <ChatRow matchDetails={item} />}
    />
  ) : (
    <View style={tw("p-6")}>
      <Text style={tw("text-center text-xl")}>No matches at the moment</Text>
    </View>
  );
};

export default ChatList;
