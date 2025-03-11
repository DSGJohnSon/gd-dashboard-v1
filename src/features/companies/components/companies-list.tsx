"use client";

import { useListAllCompanies } from "../api/use-list-companies";
import { LucideBuilding, LucideUser } from "lucide-react";
import CompaniesListSkeleton from "./skeletons/companies-list-skeleton";

function CompaniesList() {
  const { data: companies, isLoading: isLoadingCompanies } =
    useListAllCompanies();

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
                <div className="flex -space-x-2">
                  {company.userIds.length < 3 ? (
                    company.userIds.map((userId: string) => {
                      return (
                        <span
                          key={userId}
                          className="flex items-center justify-center w-5 h-5 bg-foreground text-background rounded-full border border-background">
                          <LucideUser className="size-[1.05rem] mt-1" />
                        </span>
                      );
                    })
                  ) : (
                    <>
                      <span className="flex items-center justify-center w-5 h-5 bg-foreground text-background rounded-full border border-background">
                        <LucideUser className="size-[1.05rem] mt-1" />
                      </span>
                      <span className="flex items-center justify-center w-5 h-5 bg-foreground text-background rounded-full border border-background">
                        <LucideUser className="size-[1.05rem] mt-1" />
                      </span>
                      <span className="flex items-center justify-center w-5 h-5 bg-foreground text-background text-xs rounded-full border border-background">
                        {`+${company.userIds.length - 2}`}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CompaniesList;
