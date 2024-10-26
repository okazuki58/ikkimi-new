import { useUser } from "@clerk/nextjs";
import ClientHeader from "./HeaderClient";
import { User } from "@clerk/backend";

export default async function Header() {
  const { user: currentUserData, isLoaded } = useUser();

  return <ClientHeader user={currentUserData as User | null} />;
}
