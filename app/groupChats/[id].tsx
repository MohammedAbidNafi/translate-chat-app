import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function GroupChats() {
  // Capitalized function name for convention
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello!", sender: "Alice", timestamp: "12:00 PM", isRead: true },
    {
      text: "Hi, how are you?",
      sender: "Bob",
      timestamp: "12:01 PM",
      isRead: true,
    },
    {
      text: "I'm good, thanks for asking!",
      sender: "Alice",
      timestamp: "12:02 PM",
      isRead: true,
    },
    {
      text: "What about you?",
      sender: "Bob",
      timestamp: "12:03 PM",
      isRead: false,
    },
    {
      text: "I'm doing well, just busy with work.",
      sender: "You",
      timestamp: "12:04 PM",
      isRead: false,
    },
    {
      text: "That sounds great!",
      sender: "Alice",
      timestamp: "12:05 PM",
      isRead: false,
    },
    {
      text: "What kind of work?",
      sender: "Bob",
      timestamp: "12:06 PM",
      isRead: false,
    },
    {
      text: "Just some projects for school.",
      sender: "You",
      timestamp: "12:07 PM",
      isRead: false,
    },
    {
      text: "Nice! School can be a lot sometimes.",
      sender: "Alice",
      timestamp: "12:08 PM",
      isRead: false,
    },
    {
      text: "True! But I love learning new things.",
      sender: "Bob",
      timestamp: "12:09 PM",
      isRead: false,
    },
    {
      text: "That's a good attitude!",
      sender: "Alice",
      timestamp: "12:10 PM",
      isRead: false,
    },
    {
      text: "Absolutely! Learning is key.",
      sender: "You",
      timestamp: "12:11 PM",
      isRead: false,
    },
    {
      text: "Any plans for the weekend?",
      sender: "Bob",
      timestamp: "12:12 PM",
      isRead: false,
    },
    {
      text: "I might go hiking if the weather's nice.",
      sender: "Alice",
      timestamp: "12:13 PM",
      isRead: false,
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      text: message,
      sender: "You",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isRead: false,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-neutral-900 p-4">
        <ScrollView className="flex-1 mb-4">
          {messages.map((msg, index) => (
            <View
              key={index}
              className={`p-3 mb-2 rounded-lg max-w-[75%] ${
                msg.sender === "You"
                  ? "bg-blue-600 ml-auto" // Changed to a lighter blue for visibility in dark mode
                  : "bg-neutral-800 mr-auto"
              }`}
            >
              {msg.sender !== "You" && (
                <Text className="text-accent-50 font-semibold">
                  {msg.sender}
                </Text>
              )}
              <Text className="text-white">{msg.text}</Text>
              {msg.sender === "You" ? (
                <View className="flex-row justify-end mt-1">
                  <Text className="bg-neutral-400 text-xs">
                    {msg.isRead ? "Read" : "Unread"} • {msg.timestamp}
                  </Text>
                </View>
              ) : (
                <View className="flex-row justify-between items-center mt-1">
                  <Text className="bg-neutral-400 text-xs">
                    {msg.timestamp}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Message Input */}
        <View className="flex-row items-center border-t border-gray-700 pt-2">
          <TextInput
            className="flex-1 bg-neutral-900 text-white p-3 rounded-lg mr-2"
            placeholder="Type your message..."
            placeholderTextColor="#888"
            value={message}
            onChangeText={setMessage}
          />
          <Pressable
            className="p-3 bg-blue-600 rounded-lg" // Ensure this blue is visible in dark mode
            onPress={sendMessage}
          >
            <FontAwesome name="send" size={24} color="white" />
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
