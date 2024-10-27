import { router } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Image,
  Pressable,
} from "react-native";

export default function UserComp({
  id,
  name,
  imageUrl,
}: {
  id: string;
  name: string;
  imageUrl: any;
}) {
  return (
    <Pressable
      className="flex-row items-center py-3 border-b border-gray-700"
      onPress={() => {
        router.push({ pathname: "/chats/[id]", params: { id } });
      }}
    >
      <Image
        className="w-12 h-12 object-cover rounded-full mr-4"
        source={imageUrl}
      ></Image>
      <Text className="font-semibold text-base text-primary-a-900 dark:text-primary-a-50">
        {name}
      </Text>
    </Pressable>
  );
}
