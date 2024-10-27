import UserComp from "@/components/user";
import { supabase } from "@/supabase";
import { useEffect, useState } from "react";
import { View, Text, SafeAreaView, TextInput, ScrollView } from "react-native";

interface User {
  id: string;
  name: string;
  imageUrl: string | null;
}

export default function AddUsersScreen() {
  const [name, setName] = useState<string>("");
  const [data, setData] = useState<User[]>([]);
  useEffect(() => {
    getdata();
  }, []);

  const getdata = async () => {
    try {
      // Fetch the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error fetching user:", userError.message);
        return;
      }

      // Fetch all users
      const { data: users, error } = await supabase
        .from("users")
        .select("*");
      if (error) {
        console.error("Error fetching users:", error.message);
        return;
      }

      console.log(users);

      const filteredUsers = users.filter((item) => item.id !== user?.id);
      setData(filteredUsers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <SafeAreaView className="flex bg-white p-4 items-center">
      <TextInput
        className="mt-[5px] w-full rounded-[16px] bg-primary-b-300 p-[16px] text-primary-a-900 dark:border dark:border-primary-a-400 dark:bg-transparent dark:text-primary-b-50"
        onChangeText={setName}
        placeholder="Search username"
        value={name}
      />

      <ScrollView className="w-full ">
        {data?.map((item, index) => (
          <UserComp
            key={index}
            id={item.id}
            name={item.name}
            imageUrl={item.imageUrl}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
