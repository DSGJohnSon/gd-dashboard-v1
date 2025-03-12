import { ModeToggle } from "@/components/mode-toggle";
import { getCurrent } from "@/features/auth/actions";
import LogoutButton from "@/features/auth/components/logout-button";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "GoDigital - Dashboard",
  description: "",
};

export default async function Home() {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }
  if (user.labels.includes("admin")) {
    redirect("/admin/dashboard");
  }

  return (
    <div>
      <div className="flex items-centers gap-4 p-2">
        <ModeToggle />
        <LogoutButton />
      </div>
      Homepage
    </div>
  );
}
