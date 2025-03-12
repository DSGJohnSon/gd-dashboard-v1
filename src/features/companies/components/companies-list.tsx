"use client";

import { useGetAllCompanies } from "../api/use-get-companies";
import { LucideBuilding } from "lucide-react";
import CompaniesListSkeleton from "./skeletons/companies-list-skeleton";
import UsersProfilesCount from "@/features/users/components/users-profiles-count";

function CompaniesList() {
  const { data: companies, isLoading: isLoadingCompanies } =
    useGetAllCompanies();

  console.log(companies);

  return (
    <div>
      {isLoadingCompanies ? (
        <CompaniesListSkeleton />
      ) : (
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {companies?.data?.documents.map((company) => (
            <li
              key={company.$id}
              className="py-2 px-4 rounded-md hover:bg-foreground/5 border border-input space-y-2">
              <div className="space-y-2">
                <LucideBuilding className="size-4" />
                <div className="flex flex-col">
                  <span className="text-nowrap font-bold text-sm inline-block">
                    {company.name}
                  </span>
                  <span className="inline-block text-sm">{company.siret}</span>
                </div>
                <UsersProfilesCount userIds={company.userIds} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CompaniesList;
