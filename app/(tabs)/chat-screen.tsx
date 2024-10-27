import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Pressable } from "react-native";
import { router } from "expo-router";

const contacts = [
  {
    id: 5,
    name: "Abid AI & DS (B)",
    message: "okay",
    time: "21:56",
    image: "https://via.placeholder.com/50",
  }
];

export default function ChatsScreen() {
  return (
    <View className="flex-1 bg-accent-100 p-4">
      <ScrollView>
        {contacts.map((contact) => (
          <Pressable
            key={contact.id}
            className="flex-row items-center py-3 border-b border-gray-700"
            onPress={() => {
              router.push({
                pathname: "../chats/[id]",
                params: { id: contact.id },
              });
            }}
          >
            <Image
              source={{ uri: contact.image }}
              className="w-12 h-12 rounded-full mr-4"
            />
            <View className="flex-1">
              <Text className="text-white font-semibold text-base">
                {contact.name}
              </Text>
              <Text className="text-gray-400 text-sm">{contact.message}</Text>
            </View>
            <Text className="text-gray-500 text-xs">{contact.time}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}


