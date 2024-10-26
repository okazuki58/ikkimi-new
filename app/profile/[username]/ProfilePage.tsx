"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import ProfileEditModal from "@/app/components/modal/ProfileEditModal";
import { useProfile } from "@/app/context/ProfileContext";

interface ProfileUserData {
  id: string;
  imageUrl: string;
  fullName: string;
  username?: string | null;
  firstName?: string | null;
}

interface ProfilePageProps {
  profileUser: ProfileUserData;
}

export default function ProfilePage({ profileUser }: ProfilePageProps) {
  const { user: currentUserData, isLoaded } = useUser();
  const { profile, isProfileLoading, setProfile } = useProfile();
  console.log(profile);
  const [showModal, setShowModal] = useState(false);
  if (!isLoaded) {
    return <div>読み込み中...</div>;
  }

  // 自分のプロフィールかどうかを判定
  const isOwnProfile = currentUserData?.id === profileUser.id;

  if (!profile) {
    return <div>プロフィールが読み込まれていません</div>;
  }

  return (
    <div className="w-full">
      <div className="flex gap-8 items-center ">
        <div className="overflow-hidden w-24 h-24 rounded-full">
          <img
            src={profileUser.imageUrl}
            alt="ユーザー画像"
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-2xl font-bold">{profileUser.fullName}</p>
        {isOwnProfile ? (
          <button
            type="button"
            className="flex items-center justify-center rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 border transition hover:bg-gray-100"
            onClick={() => setShowModal(true)}
          >
            プロフィールを編集
          </button>
        ) : (
          <button
            type="button"
            className={`px-4 py-2 text-sm transition font-bold rounded-md focus:outline-none w-[120px] border ${
              false // フォロー状態を適切に設定してください
                ? "bg-white text-slate-900 hover:bg-slate-100"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {false ? "フォロー中" : "フォロー"}
          </button>
        )}
      </div>

      <ProfileEditModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
