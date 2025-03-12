import { getCurrent } from "@/features/auth/actions";
import { LucideLoader } from "lucide-react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "GoDigital - Dashboard Administrateur",
  description: "",
};

export default async function DashboardAdminPage() {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }
  if (!user.labels.includes("admin")) {
    redirect("/dashboard");
  }

  return (
    <main className="p-8 h-[80svh] w-screen">
      <div className="flex items-center justify-center gap-2 h-full w-full bg-foreground/5 rounded-lg">
        <LucideLoader className="w-4 h-4 text-primary animate-spin" />
        <p className="text-primary">Redirection...</p>
      </div>
    </main>
  );
}
