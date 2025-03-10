"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowRightStartOnRectangleIcon,
  BookmarkIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

// import { User } from "@supabase/supabase-js";
import { supabase } from "@/supabaseClient";
import Image from "next/image";
import { SignedOut, SignInButton, useClerk } from "@clerk/nextjs";
import { User } from "@clerk/backend";
// import LoginModal from "@/app/components/modal/LoginModal";
// import AlgoSearch from "../AlgoSearch";

interface Profile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar_url: string;
  bio: string | null;
  created_at: string;
}

export default function ClientHeader({ user }: { user: User | null }) {
  const { signOut } = useClerk();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // 検索バーを閉じる関数
  const handleSearchBlur = () => {
    setIsAlgoSearchVisible(false);
  };

  // 検索バーの表示制御
  const [isAlgoSearchVisible, setIsAlgoSearchVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 虫眼鏡アイコンのクリックハンドラ
  const handleToggleAlgoSearch = () => {
    setIsAlgoSearchVisible(true);
  };

  // 検索バー表示時に入力欄にフォーカスを当てる
  useEffect(() => {
    if (isAlgoSearchVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAlgoSearchVisible]);

  // スクロールによってヘッダーの表示/非表示を切り替える
  const [isVisible, setIsVisible] = useState(true);
  const scrollThreshold = 120;
  let lastScrollY = 0;
  let accumulatedDelta = 0; // スクロール量の累積差分

  const handleScroll = () => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;

      accumulatedDelta += deltaY;

      if (currentScrollY === 0) {
        setIsVisible(true); // 一番上にスクロールしたときはヘッダーを表示
        accumulatedDelta = 0; // 累積差分をリセット
      } else if (accumulatedDelta > scrollThreshold) {
        setIsVisible(false); // 下にスクロールしているときにヘッダーを隠す
        accumulatedDelta = 0; // 累積差分をリセット
      } else if (accumulatedDelta < -scrollThreshold) {
        setIsVisible(true); // 上にスクロールしているときにヘッダーを表示
        accumulatedDelta = 0; // 累積差分をリセット
      }

      lastScrollY = currentScrollY;
    }
  };

  useEffect(() => {
    // プロフィールデータの取得
    if (user) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from("profiles_v2")
          .select("*")
          .eq("id", user?.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        } else {
          setProfile(data);
        }
      };

      fetchProfile();
    }
  }, [user, profile]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ドロップダウンメニューをクリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMenuOpen && !target?.closest(".relative")) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`fixed left-0 top-0 w-full transition-transform duration-300 z-10 bg-white ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:divide-y lg:divide-gray-200">
          <div className="flex h-16 items-center justify-between">
            <div className="relative z-10 flex px-0 flex-shrink-0">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/" passHref className="flex gap-1 items-center">
                  <Image src="/logo.png" alt="logo" width={210} height={100} />
                </Link>
              </div>
            </div>

            {/* デスクトップ画面の検索バー */}
            <div className="hidden md:block md:flex-grow md:max-w-[480px] w-full mx-4">
              {/* <AlgoSearch inputRef={inputRef} onBlur={null} /> */}
            </div>

            {/* アイコンとメニュー */}
            <div className="relative z-10 ml-4 flex items-center gap-5 flex-shrink-0">
              {/* モバイル画面の虫眼鏡アイコン */}
              <div className="md:hidden">
                <button
                  type="button"
                  onClick={handleToggleAlgoSearch}
                  className="relative flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <MagnifyingGlassIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>

              {user && (
                <Link href={`/profile/${profile?.username}`}>
                  <button
                    type="button"
                    className="relative flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">
                      View user's bookmarked mangas
                    </span>
                    <BookmarkIcon aria-hidden="true" className="h-6 w-6" />
                  </button>
                </Link>
              )}

              {/* Profile dropdown */}
              <div className="relative flex-shrink-0">
                {user ? (
                  <>
                    <button
                      onClick={handleMenuToggle}
                      className="relative flex rounded-full bg-white focus:outline-none"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      {profile?.avatar_url ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden border ">
                          <Image
                            src={profile.avatar_url}
                            alt={`${profile?.name}のアバター`}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full overflow-hidden border bg-gray-100"></div>
                      )}
                    </button>
                    {isMenuOpen && (
                      <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                        <Link
                          href={`/profile/${profile?.username}`}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <UserIcon className="h-5 w-5 inline-block" />{" "}
                          プロフィール
                        </Link>
                        <Link
                          href={`/${profile?.username}/settings`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Cog6ToothIcon className="h-5 w-5 inline-block" />
                          アカウント設定
                        </Link>
                        <button
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            signOut();
                            setIsMenuOpen(false);
                          }}
                        >
                          <ArrowRightStartOnRectangleIcon className="h-5 w-5 inline-block" />{" "}
                          ログアウト
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex gap-2">
                    <SignInButton>
                      <button className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800">
                        ログイン
                      </button>
                    </SignInButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* <LoginModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        /> */}
      </header>

      {/* モバイル画面の検索バー */}
      <div
        className={`md:hidden fixed top-0 left-0 z-20 h-16 p-4 bg-white w-full transition-transform duration-300 ${
          isAlgoSearchVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* <AlgoSearch inputRef={inputRef} onBlur={handleSearchBlur} /> */}
      </div>

      {/* ヘッダー分の余白を確保 */}
      <div className="w-full h-16"></div>
    </>
  );
}
