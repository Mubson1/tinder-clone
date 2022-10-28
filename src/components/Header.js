import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { View, Image, TouchableOpacity } from "react-native";
import { useTailwind } from "tailwind-rn";

import useAuth from "../hooks/useAuth";

const Header = () => {
  const tw = useTailwind();

  const { user, logout } = useAuth();
  const navigation = useNavigation();

  return (
    <View style={tw("flex-row items-center justify-between px-5 pt-1")}>
      <TouchableOpacity onPress={logout}>
        <Image
          source={{ uri: user.photoURL }}
          style={tw("h-10 w-10 rounded-full")}
        />
      </TouchableOpacity>

      <TouchableOpacity>
        <Image
          source={{
            uri: "https://www.pngitem.com/pimgs/m/33-333622_tinder-icon-tinder-icon-png-transparent-png.png",
          }}
          style={tw("h-14 w-14 rounded-full")}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
        <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
