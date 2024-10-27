import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-800 p-4">
      <View className="flex-row items-center mb-4">
        <Image
          source={{ uri: "https://via.placeholder.com/150" }} 
          className="w-24 h-24 rounded-full" 
        />
        <View className="ml-4">
          <Text className="text-xl font-semibold text-gray-800 dark:text-white">
            User Name
          </Text>
          <Text className="text-gray-600 dark:text-gray-300">
            user@example.com
          </Text>
        </View>
      </View>

      <Pressable
        className="mt-4 w-full rounded-lg bg-blue-600 py-3"
        onPress={() => {
          router.push("../saveProfile");
        }}
      >
        <View className="flex-row items-center justify-center">
          <Text className="text-white text-lg">Check Profile</Text>
        </View>
      </Pressable>

      <Pressable
        className="mt-4 w-full rounded-lg bg-error-700 py-3"
        onPress={() => {
          router.push("../auth/sign-up"); 
        }}
      >
        <View className="flex-row items-center justify-center">
          <Text className="text-white text-lg">Logout</Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}
