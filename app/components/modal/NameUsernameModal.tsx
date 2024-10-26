"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";
import { z } from "zod";
import { useProfile } from "@/app/context/ProfileContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const schema = z.object({
  name: z
    .string()
    .min(2, "名前は2文字以上で入力してください")
    .max(50, "名前は50文字以下で入力してください"),
  // usernameのバリデーションは任意で調整してください
  username: z
    .string()
    .min(4, "ユーザー名は4文字以上で入力してください")
    .max(20, "ユーザー名は20文字以下で入力してください")
    .regex(/^[a-zA-Z0-9_]+$/, "ユーザー名は英数字とアンダースコアのみ使用できます"),
});

export default function NameUsernameModal({ isOpen, onClose, userId }: ModalProps) {
  const { profile, isProfileLoading, setProfile } = useProfile();
  const [name, setName] = useState(profile?.name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [errors, setErrors] = useState<{ name?: string; username?: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setUsername(profile.username || "");
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      schema.parse({ name, username });
      setErrors({});
      setIsSaving(true);

      const { error } = await supabase
        .from("profiles_v2")
        .update({ name, username })
        .eq("id", userId);

      if (error) {
        console.error("プロフィールの更新中にエラーが発生しました:", error);
        // 必要に応じてエラーメッセージを表示
      } else {
        onClose();
      }
    } catch (e) {
      if (e instanceof z.ZodError) {
        const fieldErrors = e.errors.reduce(
          (acc: { [key: string]: string }, curr) => {
            if (curr.path && curr.path[0]) {
              acc[curr.path[0]] = curr.message;
            }
            return acc;
          },
          {}
        );
        setErrors(fieldErrors);
      }
    } finally {
      setIsSaving(false);
      toast.success("アカウント作成が完了しました");
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => { /* モーダル外クリックで閉じられないように空の関数 */ }}>
      <div className="fixed inset-0 bg-black bg-opacity-30"></div>
      <div className="fixed inset-0 flex items-center justify-center">
        <DialogPanel className="bg-white p-6 rounded-md max-w-md w-full">
          <h2 className="text-lg font-bold">プロフィール設定</h2>
          <div className="mt-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                名前 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`mt-1 block w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                ユーザー名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`mt-1 block w-full p-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving || !name || !username}
              className={`mt-4 w-full px-4 py-2 text-white rounded-md ${
                isSaving || !name || !username ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
