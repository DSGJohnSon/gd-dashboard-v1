import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { getCurrent } from "@/features/auth/actions";
import LogoutButton from "@/features/auth/components/logout-button";
import CompaniesAdd from "@/features/companies/components/admin/companies-add";
import CompaniesList from "@/features/companies/components/admin/companies-list";
import UsersList from "@/features/users/components/users-list";
import { AuthError } from "@supabase/supabase-js";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "GoDigital - Dashboard Administrateur",
  description: "",
};

export default async function Page() {
  const user = await getCurrent();
  if (user instanceof AuthError) return;
  if (!user) {
    redirect("/sign-in");
  }
  if (user.role !== "ADMIN") return redirect("/");

  return (
    <main className="p-8">
      <div className="flex items-centers gap-4 p-2">
        <ModeToggle />
        <LogoutButton />
      </div>
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
