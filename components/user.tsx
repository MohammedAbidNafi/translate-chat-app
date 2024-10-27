import { useState } from "react";
import { View, Text, SafeAreaView, TextInput, Image } from "react-native";

export default function UserComp({name,imageUrl}:{name:string,imageUrl:any}) {
  return (
  <View className="flex flex-row justify-center items-start">
    <Image className="h-24 w-24 rounded-full  " source = {imageUrl }></Image>
    <Text>{name}</Text>
  </View>
   
  );
}
