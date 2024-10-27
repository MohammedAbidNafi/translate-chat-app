import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { supabase } from "@/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GroupMessage from "@/components/group_message";

export default function GroupChat() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState<string | null>(null);
  const [destinationLanguage, setDestinationLanguage] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the authenticated user ID

    loadData();

    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "groupchats" },
        (payload: { new: any }) => {
          setMessages((prevMessages) => [...prevMessages, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadData = async () => {
    setLoading(true);

    await fetchLanguages();
    await fetchMessages();

    setLoading(false);
  };

  const fetchLanguages = async () => {
    const senderId = await AsyncStorage.getItem("id");
    console.log("senderId", senderId);
    try {
      // Fetch languages from Supabase
      const { data, error } = await supabase
        .from("users")
        .select("id, language")
        .in("id", [senderId, id]);

      if (error) {
        console.error("Error fetching user languages:", error.message);
      } else {
        // Set the source and destination languages based on the sender and receiver IDs
        data.forEach((user) => {
          if (user.id === senderId) setSourceLanguage(user.language);
        });
        console.log("Languages fetched successfully:", data);
      }
    } catch (error) {
      console.error("Unexpected error fetching languages:", error);
    }
  };

  // Fetch messages from Supabase
  const fetchMessages = async () => {
    const senderId = await AsyncStorage.getItem("id");
    const { data, error } = await supabase
      .from("groupchats")
      .select("*")
      .order("created_at", { ascending: true });

    console.log("data", data);

    if (!error) {
      // Set messages and mark isUser based on the authenticated user's ID
      const updatedMessages = data.map((msg) => ({
        ...msg,
        isUser: msg.sender_id === senderId, // Determine if the message is from the user
      }));
      setMessages(updatedMessages);
      console.log("Messages fetched successfully:", updatedMessages);
    } else {
      error && console.error("Error fetching messages:", error.message);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    const senderId = await AsyncStorage.getItem("id");
    const name = await AsyncStorage.getItem("name");
    // Define the message payload according to server requirements
    const messagePayload = {
      message: message,
      source: sourceLanguage,
      sender_id: senderId,
      group_id: id,
      sent_by: name,
    };

    try {
      // Send message to the server
      const { data, error } = await supabase
        .from("groupchats")
        .insert([messagePayload]);

      if (error) {
        console.error("Failed to send message:", error);
        return;
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (loading) {
    // Display ActivityIndicator while loading is true
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text className="text-white mt-4">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900 p-4 ">
      <ScrollView className="flex-1 mb-4">
        {messages.map((msg, index) => (
          <GroupMessage
            key={index}
            isUser={msg.isUser}
            message={msg.message}
            created_at={msg.created_at}
            source={sourceLanguage || ""}
            destination={msg.source}
          />
        ))}
      </ScrollView>
        {/* Message Input */}
        <View className="flex-row items-center border-t border-gray-700 pt-2">
          <TextInput
            className="flex-1 bg-gray-800 text-primary-a-900 dark:text-primary-b-50 p-3 rounded-lg mr-2"
            placeholder="Type your message..."
            placeholderTextColor="#888"
            value={message}
            onChangeText={setMessage}
          />
          <Pressable
            className="p-3 bg-blue-600 rounded-lg"
            onPress={sendMessage}
          >
            <Text className="text-primary-a-50">Send</Text>
          </Pressable>
        </View>
    </View>
  );
}
