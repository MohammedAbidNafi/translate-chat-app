import React, { useState, useRef } from "react";
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
  const [PhoneNo, setPhoneNo] = useState("");
  const buttonScale = useRef(new Animated.Value(1)).current;
  const router = useRouter();

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

  const handleSignUp = () => {
    if (PhoneNo.length ==10) {
      console.log("Phone Number:", PhoneNo); 
      router.push("./otpBox"); 
    } else {
      alert("Please enter correct phone number."); 
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4 justify-center w-screen h-full">
      <View>
        <Text className="text-blue-500 text-xl font-bold mb-6">Sign Up</Text>

        <TextInput
          placeholder="Phone Number"
          className="border border-gray-300 rounded-lg p-2 mb-4"
          keyboardType="phone-pad"
          value={PhoneNo}
          onChangeText={setPhoneNo}
        />

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            className="bg-blue-500 rounded-lg p-2 mb-4"
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleSignUp}
          >
            <Text className="text-white text-center font-semibold">
              Send OTP
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
