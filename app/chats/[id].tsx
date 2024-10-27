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

export default function HomeScreen() {
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
        { event: "INSERT", schema: "public", table: "chats" },
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
    await fetchUser();
    await fetchMessages();
    await fetchLanguages();
    setLoading(false);
  };

  const fetchUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error.message);
    } else {
      setUserId(user?.id || null); // Store the authenticated user's ID
    }
  };

  // Fetch messages from Supabase
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .or(`sender_id.eq.${userId},sender_id.eq.${id}`)
      .order("created_at", { ascending: true });

    if (!error) {
      // Set messages and mark isUser based on the authenticated user's ID
      const updatedMessages = data.map((msg) => ({
        ...msg,
        isUser: msg.sender_id === userId, // Determine if the message is from the user
      }));
      setMessages(updatedMessages);
      console.log("Messages fetched successfully:", updatedMessages);
    } else {
      error && console.error("Error fetching messages:", error.message);
    }
  };

  const fetchLanguages = async () => {
    try {
      // Fetch languages from Supabase
      const { data, error } = await supabase
        .from("users")
        .select("id, language")
        .in("id", [userId, id]);

      if (error) {
        console.error("Error fetching user languages:", error.message);
      } else {
        // Set the source and destination languages based on the sender and receiver IDs
        data.forEach((user) => {
          if (user.id === userId) setSourceLanguage(user.language);
          if (user.id === id) setDestinationLanguage(user.language);
        });
        console.log("Languages fetched successfully:", data);
      }
    } catch (error) {
      console.error("Unexpected error fetching languages:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    // Define the message payload according to server requirements
    const messagePayload = {
      message: message,
      source: sourceLanguage, // or dynamically set this based on your app’s context
      destination: destinationLanguage,
      sender_id: userId, // Use the authenticated user ID
      receiver_id: id, // Replace with appropriate receiver ID
    };

    try {
      // Send message to the server
      const response = await fetch("http://192.168.1.88:8080/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messagePayload),
      });

      if (response.ok) {
        // Reset message input on successful send
        setMessage("");

        // Fetch the updated messages from Supabase
        fetchMessages();
      } else {
        console.error("Error sending message:", response.statusText);
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
          <View
            key={index}
            className={`p-3 mb-2 rounded-lg max-w-3/4 ${
              msg.isUser ? "bg-blue-500 ml-auto" : "bg-warning-100 mr-auto"
            }`}
          >
            <Text className="text-white w-96">
              {msg.isUser ? msg.message : msg.trans_message}
            </Text>
            <View className="flex-row justify-between items-center mt-1">
              <Text className="text-accent-300 text-xs">{msg.created_at}</Text>
              {msg.isUser && (
                <Text className="text-accent-300 text-xs">
                  {msg.isRead ? "Read" : "Unread"}
                </Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      <KeyboardAwareScrollView>
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
            <Text className="text-white">Send</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
