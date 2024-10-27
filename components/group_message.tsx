import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

const GroupMessage = ({
  isUser,
  message,
  created_at,
  source,
  destination,
}: {
  isUser: boolean;
  message: string;
  created_at: string;
  source: string;
  destination: string;
}) => {
  const [translatedMessage, setTranslatedMessage] = useState("");

  const translateMessage = async () => {
    console.log("Translating message:", message);
    // Define the translation payload according to server requirements

    if (isUser) {
      setTranslatedMessage(message);
    } else {
      const translationPayload = {
        text: message,
        source: source,
        target: destination,
      };

      try {
        // Send message to the server
        const response = await fetch("http://192.168.1.88:8080/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(translationPayload),
        });

        if (response.ok) {
          // Reset message input on successful send
          const data = await response.json();
          setTranslatedMessage(data.translatedText);
        } else {
          console.error("Error sending message:", response.statusText);
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  useEffect(() => {
    translateMessage();
  }, []);

  return (
    <View
      className={`p-3 mb-2 rounded-lg max-w-3/4 ${
        isUser ? "bg-blue-500 ml-auto" : "bg-warning-100 mr-auto"
      }`}
    >
      <Text className="text-white w-96">{translatedMessage}</Text>
      <View className="flex-row justify-between items-center mt-1">
        <Text className="text-accent-300 text-xs">{created_at}</Text>
      </View>
    </View>
  );
};

export default GroupMessage;
