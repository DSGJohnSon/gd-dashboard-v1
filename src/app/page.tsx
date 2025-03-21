import { getCurrent } from "@/features/auth/actions";
import CompanyRedirect from "@/features/companies/components/company-redirect";
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
  if (user.labels.includes("admin")) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="flex items-center justify-center h-screen w-screen">
      <CompanyRedirect user={user} />
    </main>
  );
}
