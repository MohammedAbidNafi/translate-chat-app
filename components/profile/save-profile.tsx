import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/supabase";

export default function SaveProfileComp() {
  const languages = [
    { label: "Afrikaans", value: "af" },
    { label: "Albanian", value: "sq" },
    { label: "Amharic", value: "am" },
    { label: "Arabic", value: "ar" },
    { label: "Armenian", value: "hy" },
    { label: "Azerbaijani", value: "az" },
    { label: "Bengali", value: "bn" },
    { label: "Bosnian", value: "bs" },
    { label: "Bulgarian", value: "bg" },
    { label: "Catalan", value: "ca" },
    { label: "Chinese (Simplified)", value: "zh" },
    { label: "Chinese (Traditional)", value: "zh-TW" },
    { label: "Croatian", value: "hr" },
    { label: "Czech", value: "cs" },
    { label: "Danish", value: "da" },
    { label: "Dari", value: "fa-AF" },
    { label: "Dutch", value: "nl" },
    { label: "English", value: "en" },
    { label: "Estonian", value: "et" },
    { label: "Farsi (Persian)", value: "fa" },
    { label: "Filipino, Tagalog", value: "tl" },
    { label: "Finnish", value: "fi" },
    { label: "French", value: "fr" },
    { label: "French (Canada)", value: "fr-CA" },
    { label: "Georgian", value: "ka" },
    { label: "German", value: "de" },
    { label: "Greek", value: "el" },
    { label: "Gujarati", value: "gu" },
    { label: "Haitian Creole", value: "ht" },
    { label: "Hausa", value: "ha" },
    { label: "Hebrew", value: "he" },
    { label: "Hindi", value: "hi" },
    { label: "Hungarian", value: "hu" },
    { label: "Icelandic", value: "is" },
    { label: "Indonesian", value: "id" },
    { label: "Irish", value: "ga" },
    { label: "Italian", value: "it" },
    { label: "Japanese", value: "ja" },
    { label: "Kannada", value: "kn" },
    { label: "Kazakh", value: "kk" },
    { label: "Korean", value: "ko" },
    { label: "Latvian", value: "lv" },
    { label: "Lithuanian", value: "lt" },
    { label: "Macedonian", value: "mk" },
    { label: "Malay", value: "ms" },
    { label: "Malayalam", value: "ml" },
    { label: "Maltese", value: "mt" },
    { label: "Marathi", value: "mr" },
    { label: "Mongolian", value: "mn" },
    { label: "Norwegian (Bokmål)", value: "no" },
    { label: "Pashto", value: "ps" },
    { label: "Polish", value: "pl" },
    { label: "Portuguese (Brazil)", value: "pt" },
    { label: "Portuguese (Portugal)", value: "pt-PT" },
    { label: "Punjabi", value: "pa" },
    { label: "Romanian", value: "ro" },
    { label: "Russian", value: "ru" },
    { label: "Serbian", value: "sr" },
    { label: "Sinhala", value: "si" },
    { label: "Slovak", value: "sk" },
    { label: "Slovenian", value: "sl" },
    { label: "Somali", value: "so" },
    { label: "Spanish", value: "es" },
    { label: "Spanish (Mexico)", value: "es-MX" },
    { label: "Swahili", value: "sw" },
    { label: "Swedish", value: "sv" },
    { label: "Tamil", value: "ta" },
    { label: "Telugu", value: "te" },
    { label: "Thai", value: "th" },
    { label: "Turkish", value: "tr" },
    { label: "Ukrainian", value: "uk" },
    { label: "Urdu", value: "ur" },
    { label: "Uzbek", value: "uz" },
    { label: "Vietnamese", value: "vi" },
    { label: "Welsh", value: "cy" },
  ];

  const [name, setName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLanguages, setFilteredLanguages] = useState(languages);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null); // Image URI state
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);

    // Clear the selected language if the query is empty
    if (query === "") {
      setSelectedLanguage(null);
      setFilteredLanguages(languages); // Reset filtered languages to show all
    } else {
      setFilteredLanguages(
        languages.filter((lang) =>
          lang.label.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  // Handle selection of a language
  const onSelectLanguage = (lang: string) => {
    setSelectedLanguage(lang);
    setSearchQuery("");
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      uploadImageToSupabase(uri); // Trigger upload with URI
    }
  };

  // Upload Image to Supabase using a File object
  const uploadImageToSupabase = async (uri: string) => {
    try {
      const fileName = `profile_${Date.now()}.jpg`;

      // Fetch the file from the URI and create a File object
      const response = await fetch(uri);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: "image/jpeg" });

      // Upload the file directly to Supabase storage
      const { data, error } = await supabase.storage
        .from("profile") // Ensure the bucket name is correct
        .upload(fileName, file, { upsert: false });

      if (error) {
        console.log("Upload Error:", error);
        return;
      }

      // Retrieve the public URL if upload is successful
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("profile") // Correct bucket name
        .getPublicUrl(fileName);

      setImageUrl(publicUrl);
      console.log("File uploaded successfully:", publicUrl);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };
  const saveData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log(user);
    if (!name || !selectedLanguage || !imageUrl) {
      alert("Please fill all the fields");
      console.log(name, selectedLanguage, imageUrl);
      return;
    }

    const { data, error } = await supabase.from("users").insert({
      id: user?.id,
      name: name,
      imageUrl: imageUrl,
      language: selectedLanguage,
    });

    if (error) {
      alert("Error saving data: " + error);
      console.error("Error saving data:", error);
    }

    router.replace("/");
  };

  return (
    <KeyboardAwareScrollView>
      <View className=" bg-primary-b-600 dark:bg-primary-a-600 flex items-center justify-center m-5 p-5 rounded">
        <Text className="text-[28px] text-primary-a-500 dark:text-primary-b-50">
          Enter your details
        </Text>
        <Pressable onPress={pickImage} className="my-10">
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                resizeMode: "cover",
              }}
            />
          ) : (
            <View>
              <View className="w-24 h-24 rounded-full bg-primary-a-200 flex items-center justify-center"></View>
              <Text className="text-blue-500 mt-2">Upload Image</Text>
            </View>
          )}
        </Pressable>
        <View className="w-full mt-[12px]">
          <Text className="text-primary-a-500 dark:text-primary-b-50 ml-2">
            Enter Username
          </Text>
          <TextInput
            className="mt-[5px] w-full rounded-[16px] bg-primary-b-300 p-[16px] text-primary-a-900 dark:border dark:border-primary-a-400 dark:bg-transparent dark:text-primary-b-50"
            onChangeText={setName}
            placeholder="Enter your username"
            value={name}
          />
        </View>

        <View className="w-full mt-[12px]">
          <Text className="text-primary-a-500 dark:text-primary-b-50 ml-2">
            Select Language
          </Text>
          <TextInput
            className="mt-[5px] w-full rounded-[16px] bg-primary-b-300 p-[16px] text-primary-a-900 dark:border dark:border-primary-a-400 dark:bg-transparent dark:text-primary-b-50"
            placeholder="Enter your primary language"
            onChangeText={onChangeSearch}
            value={
              searchQuery ||
              (selectedLanguage &&
                languages.find((lang) => lang.value === selectedLanguage)
                  ?.label) ||
              ""
            }
          />
          {searchQuery.length > 0 && (
            <FlatList
              data={filteredLanguages}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable onPress={() => onSelectLanguage(item.value)}>
                  <View className="py-5 px-2 bg-primary-b-100 dark:bg-primary-a-500 border-b  dark:border-primary-a-400">
                    <Text className="text-primary-a-900 dark:text-primary-b-50">
                      {item.label}
                    </Text>
                  </View>
                </Pressable>
              )}
              className="bg-primary-b-600 dark:bg-primary-a-600 absolute w-full mt-24 rounded-xl z-10"
              style={{
                maxHeight: 200,
                overflow: "hidden",
              }}
            />
          )}
          <Pressable
            className="mt-[12px] w-full rounded-[16px] bg-primary-b-300 py-[16px] dark:bg-primary-a-900"
            onPress={saveData}
          >
            <View className="flex-row items-center justify-center">
              <Text className="ml-[4px] text-center text-[16px] text-primary-a-500 dark:text-primary-b-50">
                Save Data
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
