import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";

import { useState } from "react";
export default function HomeScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello!", isUser: false, timestamp: "12:00 PM", isRead: true },
    {
      text: "Hi, how are you?",
      isUser: true,
      timestamp: "12:01 PM",
      isRead: true,
    },
    {
      text: "I'm good, thanks for asking!",
      isUser: false,
      timestamp: "12:02 PM",
      isRead: true,
    },
    {
      text: "What about you?",
      isUser: false,
      timestamp: "12:03 PM",
      isRead: false,
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      text: message,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isRead: false,
    };

    // Add the new message to the list
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");
  };

  return (
    <View className="flex-1 bg-gray-900 p-4 ">
      <ScrollView className="flex-1 mb-4">
        {messages.map((msg, index) => (
          <View
            key={index}
            className={`p-3 mb-2 rounded-lg max-w-3/4 ${
              msg.isUser ? "bg-blue-500 ml-auto" : "bg-warning-100 mr-auto"
            }`}
          >
            <Text className="text-white w-96">{msg.text}</Text>
            <View className="flex-row justify-between items-center mt-1">
              <Text className="text-accent-300 text-xs">{msg.timestamp}</Text>
              {msg.isUser && (
                <Text className="text-accent-300 text-xs">
                  {msg.isRead ? "Read" : "Unread"}
                </Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Message Input */}
      <View className="flex-row items-center border-t border-gray-700 pt-2">
        <TextInput
          className="flex-1 bg-gray-800 text-white p-3 rounded-lg mr-2"
          placeholder="Type your message..."
          placeholderTextColor="#888"
          value={message}
          onChangeText={setMessage}
        />
        <Pressable className="p-3 bg-blue-600 rounded-lg" onPress={sendMessage}>
          <Text className="text-white">Send</Text>
        </Pressable>
      </View>
    </View>
  );
}
