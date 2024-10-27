import UserComp from "@/components/user";
import { supabase } from "@/supabase";
import { useEffect, useState } from "react";
import { View, Text, SafeAreaView, TextInput, ScrollView } from "react-native";

export default function AddUsersScreen() {
  const [name, setName] = useState("");
  const [data, setData] = useState<any[] | null>([]);

  useEffect(() => {
    getdata();
  }, []);

  const getdata = async () => {
    try {
      let { data: users, error } = await supabase.from("users").select("*");
      console.log(users);
      setData(users);
    } catch (error) {}
  };
  return (
    <SafeAreaView className="flex  bg-white p-4 items-center">
      <TextInput
        className="mt-[5px] w-full rounded-[16px] bg-primary-b-300 p-[16px] text-primary-a-900 dark:border dark:border-primary-a-400 dark:bg-transparent dark:text-primary-b-50"
        onChangeText={setName}
        placeholder="Search username"
        value={name}
      />

      <ScrollView className="w-full ">
        {data?.map((item) => (
          <UserComp key={item.id} id={item.id} name={item.name} imageUrl={item.imageUrl} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
