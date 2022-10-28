import StackNavigator from "./src/navigator/StackNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/hooks/useAuth";
import { TailwindProvider } from "tailwind-rn";
import utilities from "./tailwind.json";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <TailwindProvider utilities={utilities}>
          <StackNavigator />
        </TailwindProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
