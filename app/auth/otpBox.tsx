import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";

export default function SignUp() {
    const router = useRouter();

    //gpt generated starts
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
//got generated animations end

  return (
    <SafeAreaView className="flex-1 bg-gray-100 justify-center p-4">
     
        <TextInput
          placeholder="Enter OTP"
          className="border border-gray-300 rounded-lg p-2 mb-4"
          keyboardType="phone-pad"
        />
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            className="bg-blue-500 rounded-lg p-2 mb-4"
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text className="text-white text-center font-semibold">
              verify
            </Text>
          </TouchableOpacity>
        </Animated.View>
    </SafeAreaView>
  );
}
