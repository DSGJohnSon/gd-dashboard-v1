"use client";

import { Switch } from "@/components/ui/switch";
import { useCurrent } from "@/features/auth/api/use-current";
import { useLogout } from "@/features/auth/api/use-logout";
import { LucideLogOut, LucideMoon, LucideSun } from "lucide-react";
import { useTheme } from "next-themes";
import { redirect } from "next/navigation";

export default function Home() {
  const user = useCurrent();
  if (!user) {
    redirect("/sign-in");
  }
  if (user.data?.data.labels.includes("admin")) {
    redirect("/admin/dashboard");
  }

  return <div>Homepage</div>;
}
