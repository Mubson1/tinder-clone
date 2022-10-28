import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useRef } from "react";
import { useTailwind } from "tailwind-rn/dist";
import Swiper from "react-native-deck-swiper";
import { AntDesign, Entypo } from "@expo/vector-icons";

import { DUMMY_DATA } from "../../data";

const CardSwipe = () => {
  const tw = useTailwind();

  const swipeRef = useRef(null);
  return (
    <>
      <View style={tw("flex-1 -mt-6")}>
        <Swiper
          ref={swipeRef}
          cards={DUMMY_DATA}
          containerStyle={{ backgroundColor: "transparent" }}
          stackSize={5}
          cardIndex={0}
          verticalSwipe={false}
          animateCardOpacity
          onSwipedLeft={() => {}}
          onSwipedRight={() => {}}
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
          renderCard={(card) => (
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
                    {card.firstName} {card.lastName}
                  </Text>
                  <Text>{card.job}</Text>
                </View>
                <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
              </View>
            </View>
          )}
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

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

export default CardSwipe;
