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

export default function GroupComp({
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
      className="flex flex-row justify-start items-center border-t-2 border-b-2 my-5"
      onPress={() => {
        router.push({ pathname: "/group/[id]", params: { id } });
      }}
    >
      <Image className="h-24 w-24 rounded-full  " source={imageUrl}></Image>
      <Text className="text-3xl text-primary-a-900 dark:text-primary-a-50">
        {name}
      </Text>
    </Pressable>
  );
}
