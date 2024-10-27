import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Pressable,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { supabase } from "@/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUp() {
  const [OTP, setOTP] = useState("");
  const router = useRouter();
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

  const verifyOtp = async () => {
    const PhoneNo = await AsyncStorage.getItem("phone");
    if (!PhoneNo || PhoneNo.length !== 10) {
      alert("Please enter correct phone number.");
      return;
    }
    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      phone: "+91" + PhoneNo,
      token: OTP,
      type: "sms",
    });

    if (error) {
      alert(error.message);
      console.log(error);
      return;
    } else {
      console.log("OTP verified successfully");
    }
    router.push("/saveProfile");
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-200 justify-center p-4">
      <Stack.Screen options={{ title: "Verify OTP" }} />
      <View className="w-full px-10">
        <TextInput
          className="mt-[5px] w-full rounded-[16px] bg-primary-b-300 p-[16px] text-primary-a-900 dark:border dark:border-primary-a-400 dark:bg-transparent dark:text-primary-b-50"
          placeholder="Enter OTP"
          keyboardType="phone-pad"
          value={OTP}
          onChangeText={setOTP}
        />
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <Pressable
            className="mt-[12px] w-full rounded-[16px]  py-[16px] bg-primary-a-900"
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={verifyOtp}
          >
            <View className="flex-row items-center justify-center">
              <Text className="ml-[4px] text-center text-[16px] text-primary-b-50">
                Verify
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
