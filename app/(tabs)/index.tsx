import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
export default function HomeScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-blue-500 text-xl font-bold">Home Screen</Text>

      <View className="flex-row mt-4">
        <TouchableOpacity onPress={()=>{
          router.push("/auth/sign-up");
        }} >
          <Text className="text-blue-600">SignUp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

