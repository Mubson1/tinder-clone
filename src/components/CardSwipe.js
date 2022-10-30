import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTailwind } from "tailwind-rn/dist";
import Swiper from "react-native-deck-swiper";
import { AntDesign, Entypo } from "@expo/vector-icons";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

// import { DUMMY_DATA } from "../../data";
import { db } from "../../firebase";
import useAuth from "../hooks/useAuth";
import generateId from "../lib/generateIds";
import { styles } from "../styles";

const CardSwipe = () => {
  const tw = useTailwind();
  const navigation = useNavigation();

  const { user } = useAuth();

  const [profiles, setProfiles] = useState({});
  const swipeRef = useRef(null);

  useLayoutEffect(
    () =>
      //we are getting the data of the user from the firebase collection i.e. from db/users/user.uid
      onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        //if the user data is not in our firebase, navigate them to the modal page
        if (!snapshot.exists()) {
          navigation.navigate("Modal");
        }
      }),
    []
  );

  useEffect(() => {
    let unsub;
    const fetchCards = async () => {
      //this passes will be an array that contains the id of users who have been already swiped left
      const passes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then(
        //getDocs returns a snapshot of the passes collection
        (snapshot) => snapshot.docs.map((doc) => doc.id)
      );

      const likes = await getDocs(
        collection(db, "users", user.uid, "likes")
      ).then(
        //getDocs returns a snapshot of the passes collection
        (snapshot) => snapshot.docs.map((doc) => doc.id)
      );

      //what if the user have not passed on any one? This would return an error for the above passes. So, we declare another variable which actually stores the value of id who have been swept left and stores test if non has been swiped left
      //we do this because to query below in unsub, we must pass a value. it should not be an empty array. So-test. And it really doesn't matter if we put a value of test  as query because the user id wont be 'test' anyway
      const passedUserIds = passes.length > 0 ? passes : ["test"];
      const likedUserIds = likes.length > 0 ? likes : ["test"];

      //we are only getting the details of users who have not been registered into the 'passes' collection by using query or those who have already been liked
      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passedUserIds, ...likedUserIds])
        ),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              //I don't want my own profile to be showing in my tinder swiperCards. So, filter before mapping
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        }
      );
    };

    fetchCards();
    return unsub;
  }, [db]);

  const swipeLeft = (cardIndex) => {
    if (!profiles[cardIndex]) return;

    //get all relevant user data who have been swiped left
    const userSwiped = profiles[cardIndex];

    //for development only
    console.log(`You swiped PASS on ${userSwiped.displayName}`);

    //we are going into db/users/user.id/passes/userSwiped.id
    setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
  };

  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    //get all relevant user data who have been swiped right
    const userSwiped = profiles[cardIndex];

    //get the data of the user who is logged in. useAuth does not provide details about jobs, age, and profile pic
    const loggedInProfile = await (
      await getDoc(doc(db, "users", user.uid))
    ).data();

    //check if the user who I have swiped right has also swiped left - go to db/users/userSwiped.id/likes/user.uid. Now, this user.uid wil only be present if they liked us and getDoc will return documentSnapshot
    getDoc(doc(db, "users", userSwiped.id, "likes", user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          //user has matched with you before you matched with them
          console.log(`Hooray, You MATCHED with ${userSwiped.displayName}`);

          // we are recording that we have liked this person
          setDoc(
            doc(db, "users", user.uid, "likes", userSwiped.id),
            userSwiped
          );

          //CREATE A MATCH by creating a new collection - matches
          setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });

          //passing props when navigating to another screen
          navigation.navigate("Match", {
            loggedInProfile,
            userSwiped,
          });
        } else {
          //user has swiped as first interaction between the two or didn't get swiped on
          console.log(
            `You liked ${userSwiped.displayName} (${userSwiped.job})`
          );

          //we are going into db/users/user.id/likes/userSwiped.id and recording that we have liked this person
          setDoc(
            doc(db, "users", user.uid, "likes", userSwiped.id),
            userSwiped
          );
        }
      }
    );
  };

  return (
    <>
      <View style={tw("flex-1 -mt-6")}>
        <Swiper
          ref={swipeRef}
          cards={profiles}
          containerStyle={{ backgroundColor: "transparent" }}
          stackSize={5}
          cardIndex={0}
          verticalSwipe={false}
          animateCardOpacity
          onSwipedLeft={(cardIndex) => {
            swipeLeft(cardIndex);
          }}
          onSwipedRight={(cardIndex) => {
            swipeRight(cardIndex);
          }}
          backgroundColor={"#4FD0E9"}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  textAlign: "left",
                  color: "#4DED30",
                },
              },
            },
          }}
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                style={tw("relative bg-white h-[75%] rounded-xl")}
              >
                <Image
                  source={{ uri: card.photoURL }}
                  style={tw("absolute top-0 h-full w-full rounded-xl")}
                />
                <View
                  style={[
                    tw(
                      "absolute bottom-0 flex-row justify-between items-center bg-white w-full h-20 px-6 py-2 rounded-b-xl"
                    ),
                    styles.cardShadow,
                  ]}
                >
                  <View>
                    <Text style={tw("text-xl font-bold")}>
                      {card.displayName}
                    </Text>
                    <Text>{card.job}</Text>
                  </View>
                  <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  tw(
                    "relative bg-white h-[75%] rounded-xl justify-center items-center"
                  ),
                  styles.cardShadow,
                ]}
              >
                <Text style={tw("font-bold pb-5")}>No more profiles</Text>
                <Image
                  style={tw("h-24 w-24")}
                  height={100}
                  width={100}
                  source={{ uri: "https://links.papareact.com/6gb" }}
                />
              </View>
            )
          }
        />
      </View>

      <View style={tw("flex flex-row justify-evenly")}>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-red-200"
          )}
        >
          <Entypo name="cross" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-green-200"
          )}
        >
          <AntDesign name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default CardSwipe;
