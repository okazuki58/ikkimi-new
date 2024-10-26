"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { supabase } from "@/supabaseClient";
import { useUser } from "@clerk/nextjs";
import { Profile } from "../lib/definitions";

interface ProfileContextType {
  profile: Profile | null;
  isProfileLoading: boolean;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}

// コンテキストの作成
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoaded } = useUser(); // clerkからuser情報を取得
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  console.log(user);

  useEffect(() => {
    // プロフィールデータの取得
    const fetchProfile = async () => {
      if (!user?.id || !isLoaded) return;

      setIsProfileLoading(true);
      console.log("userId", user.id);
      const { data, error } = await supabase
        .from("profiles_v2")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error.details);
        toast.error("プロフィールの取得に失敗しました");
      } else {
        setProfile(data);
        console.log(profile);
      }

      setIsProfileLoading(false);
    };

    fetchProfile();
  }, [user]);

  return (
    <ProfileContext.Provider value={{ profile, isProfileLoading, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

// カスタムフックで簡単にContextを利用
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
