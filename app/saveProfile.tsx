import SaveProfileComp from "@/components/profile/save-profile";
import { Stack } from "expo-router";
import { View, Text, SafeAreaView } from "react-native";

export default function SaveProfile() {
  return (
    <SafeAreaView>
      <Stack.Screen options={{ title: "Save Profile" }} />
      <SaveProfileComp />
    </SafeAreaView>
  );
}
