import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/supabase";
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

  const handleSignUp = async () => {
    AsyncStorage.setItem("phone", PhoneNo);
    if (PhoneNo.length == 10) {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: "+91" + PhoneNo,
      });

      if (error) {
        alert(error.message);
        console.log(error);
        return;
      }
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
          className="mt-[5px] w-full rounded-[16px] bg-primary-b-300 p-[16px] text-primary-a-900 dark:border dark:border-primary-a-400 dark:bg-transparent dark:text-primary-b-50"
          keyboardType="phone-pad"
          value={PhoneNo}
          onChangeText={setPhoneNo}
        />

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <Pressable
            className="mt-[12px] w-full rounded-[16px] bg-primary-b-300 py-[16px] dark:bg-primary-a-900"
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleSignUp}
          >
            <View className="flex-row items-center justify-center">
              <Text className="ml-[4px] text-center text-[16px] text-primary-a-500 dark:text-primary-b-50">
                Send OTP
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
