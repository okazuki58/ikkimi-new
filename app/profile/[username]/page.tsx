import { notFound } from "next/navigation";
import ProfilePage from "./ProfilePage";
import { supabase } from "@/supabaseClient";

export default async function UserProfile({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await params;
  console.log("username", username);

  if (!username) {
    notFound();
  }

  try {
    const { data: profileUser, error } = await supabase
      .from("profiles_v2")
      .select("*")
      .eq("username", username)
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
