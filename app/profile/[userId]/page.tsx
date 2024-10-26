import { createClerkClient } from "@clerk/backend";
import { notFound } from "next/navigation";
import ProfilePage from "./ProfilePage";
import { supabase } from "@/supabaseClient";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export default async function UserProfile({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = await params;

  if (!userId) {
    notFound();
  }

  try {
    const { data: profileUser, error } = await supabase
      .from("profiles_v2")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !profileUser) {
      console.error("Supabaseからユーザー情報の取得に失敗しました。", error);
      notFound();
    }

    const profileUserData = {
      id: profileUser.id,
      imageUrl: profileUser.avatar_url || "",
      fullName: profileUser.name || "名無し",
      username: profileUser.username ?? undefined,
      firstName: profileUser.name ?? undefined,
    };

    return <ProfilePage profileUser={profileUserData} />;
  } catch (error) {
    console.error("ユーザー情報の取得に失敗しました。", error);
    notFound();
  }
}
