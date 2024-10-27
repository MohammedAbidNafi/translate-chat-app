import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView>
      <Text className="text-blue-500 text-xl font-bold">Home Screen</Text>
      <View className="flex-row mt-4">
        <Pressable
          onPress={() => {
            router.push("./auth/sign-up");
          }}
        >
          <Text className="text-blue-600">SignUp</Text>
        </Pressable>
      </View>
      <Pressable
        className="mt-[12px] w-full rounded-[16px] bg-primary-b-300 py-[16px] dark:bg-primary-a-500"
        onPress={() => router.replace("./saveProfile")}
      >
        <View className="flex-row items-center justify-center">
          <Text className="ml-[4px] text-center text-[16px] text-primary-a-500 dark:text-primary-b-50">
            Go to save
          </Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}
