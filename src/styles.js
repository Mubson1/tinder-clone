import { StatusBar } from "react-native";

export const safeArea = {
  paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
};
