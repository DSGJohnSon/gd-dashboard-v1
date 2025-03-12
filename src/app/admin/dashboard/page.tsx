import { Separator } from "@/components/ui/separator";
import { getCurrent } from "@/features/auth/actions";
import CompaniesAdd from "@/features/companies/components/companies-add";
import CompaniesList from "@/features/companies/components/companies-list";
import UsersList from "@/features/users/components/users-list";
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
    <main className="p-8">
      <h1 className="font-bold text-xl">Dashboard Admin</h1>
      <Separator className="my-4" />
      <section>
        <h2 className="font-bold mb-2">Users</h2>
        <div>
          <UsersList />
        </div>
        <h2 className="font-bold mb-2 mt-8">Companies</h2>
        <div>
          <CompaniesAdd />
          <CompaniesList />
        </div>
      </section>
    </main>
  );
}
