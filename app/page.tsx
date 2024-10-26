"use client";

import { supabase } from "@/supabaseClient";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { z } from "zod";
import ProfileEditModal from "./components/modal/ProfileEditModal";
import NameUsernameModal from "./components/modal/NameUsernameModal";

export default function Home() {
  const { user: currentUserData, isLoaded } = useUser();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isLoaded && currentUserData) {
      const userData = {
        id: currentUserData.id,
        email: currentUserData.primaryEmailAddress?.emailAddress || "",
        fullName: `${currentUserData.firstName || ""} ${
          currentUserData.lastName || ""
        }`.trim(),
        imageUrl: currentUserData.imageUrl || "",
      };

      insertUserProfile(userData);
    }
  }, [isLoaded, currentUserData]);

  function generateUsername(): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "user_";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  async function insertUserProfile(userData: any) {
    const { data: existingProfile } = await supabase
      .from("profiles_v2")
      .select("*")
      .eq("id", userData.id)
      .single();

    if (!existingProfile) {
      const { error } = await supabase.from("profiles_v2").insert({
        id: userData.id as string,
        name: userData.fullName,
        avatar_url: userData.imageUrl,
        email: userData.email,
        username: generateUsername(),
      });

      if (error) {
        console.error("プロフィールの挿入中にエラーが発生しました:", error);
        return;
      }
      setShowModal(true);
    } else if (!existingProfile.name || existingProfile.name.trim() === "") {
      // 名前が空の場合、モーダルを表示
      setShowModal(true);
    }
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!currentUserData) {
    return <div>ログインしてない人用のページです！</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">今日発売の新刊</h1>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-x-2 sm:gap-x-3 gap-y-5">
        {[...Array(14)].map((_, i) => (
          <div key={i} className="flex flex-col pb-1">
            <div className="flex flex-col gap-2 pb-2">
              <div
                className="rounded-md overflow-hidden bg-gray-200 relative"
                style={{ paddingTop: `${(780 / 549) * 100}%` }}
              >
                <div className="absolute inset-0"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <NameUsernameModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          userId={currentUserData?.id}
        />
      )}
    </div>
  );
}
