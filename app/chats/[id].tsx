import { useLocalSearchParams, Stack } from "expo-router";
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

export default function HomeScreen() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState("");
  const [Acc, setAcc] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState<string | null>(null);
  const [destinationLanguage, setDestinationLanguage] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [userName]);

  const loadData = async () => {
    setLoading(true);
    await fetchUser();
    await fetchMessages();
    await fetchUserById(id);
    await fetchLanguages();
    setLoading(false);
  };

  const fetchUserById = async (userId: any) => {
    const { data, error } = await supabase
      .from("users")
      .select("name")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user's name:", error.message);
    } else {
      const name = data?.name || "User";
      setAcc(name); // Set the fetched name to userName state
      console.log("Fetched user's name:", name);
    }
  };
  const fetchUser = async () => {
    // Fetch the current authenticated user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error fetching user:", error.message);
      return; // Exit if there's an error
    }

    // Set the user ID
    setUserId(user?.id || null);

    // Fetch the user's name from the "users" table
    const { data, error: fetchError } = await supabase
      .from("users")
      .select("name")
      .eq("id", user?.id)
      .single();

    if (fetchError) {
      console.error("Error fetching user's name:", fetchError.message);
    } else {
      const fetchedName = data?.name || "User"; // Default to "User" if name is not found
      setUserName(fetchedName);

      console.log("User name fetched successfully:", fetchedName); // Log the fetched name
    }
  };

  // Fetch messages from Supabase
  const fetchMessages = async () => {
    const senderId = await AsyncStorage.getItem("id");
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .or(
        `and(sender_id.eq.${senderId},receiver_id.eq.${id}),and(sender_id.eq.${id},receiver_id.eq.${senderId})`
      )
      .order("created_at", { ascending: true });

    if (!error) {
      const updatedMessages = data.map((msg) => ({
        ...msg,
        isUser: msg.sender_id === senderId,
      }));
      setMessages(updatedMessages);
      console.log("Messages fetched successfully:", updatedMessages);
    } else {
      error && console.error("Error fetching messages:", error.message);
    }
  };

  const fetchLanguages = async () => {
    const senderId = await AsyncStorage.getItem("id");
    console.log("senderId", senderId);

    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, language")
        .in("id", [senderId, id]);

      if (error) {
        console.error("Error fetching user languages:", error.message);
      } else {
        data.forEach((user) => {
          if (user.id === senderId) setSourceLanguage(user.language);
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

    const messagePayload = {
      message: message,
      source: sourceLanguage,
      destination: destinationLanguage,
      sender_id: userId,
      receiver_id: id,
    };

    try {
      const response = await fetch("http://192.168.1.5:8080/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messagePayload),
      });

      if (response.ok) {
        setMessage("");
        fetchMessages();
      } else {
        console.error("Error sending message:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text className="text-white mt-4">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900  p-4">
      {/* Set up the Stack.Screen header with userName */}
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View className="flex-row items-center">
              {Acc ? (
                <Text className="text-lg text-white">{Acc}</Text>
              ) : (
                <ActivityIndicator size="small" color="#1E90FF" />
              )}
            </View>
          ),
        }}
      />
      <ScrollView className="flex-1 h-full mb-4">
        {messages.map((msg, index) => (
          <View
            key={index}
            className={`p-3 mb-2 rounded-lg max-w-3/4 ${
              msg.isUser ? "bg-blue-500 ml-auto" : "bg-warning-100 mr-auto"
            }`}
          >
            <Text className="text-primary-a-50 w-96">
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
