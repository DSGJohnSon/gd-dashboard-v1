import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CompaniesAdd from "@/features/companies/components/companies-add";
import UsersList from "@/features/users/components/users-list";
import React from "react";

function DashboardAdminPage() {
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
        </div>
      </section>
    </main>
  );
}

export default DashboardAdminPage;
