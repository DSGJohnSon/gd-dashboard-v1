"use client";

import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";

import { NavUser } from "@/components/sidebar/user/nav-user";
import { TeamSwitcher } from "@/features/companies/components/user/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useGetCompaniesByUserId } from "@/features/companies/api/use-get-companies";
import { Models } from "node-appwrite";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: Models.User<Models.Preferences>;
  activeCompanyId: string;
}

export function AppSidebar({
  user,
  activeCompanyId,
  ...props
}: AppSidebarProps) {
  const { data: companies, isLoading: isLoadingCompanies } =
    useGetCompaniesByUserId(user.$id);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {isLoadingCompanies ? (
          <GalleryVerticalEnd className="size-8" />
        ) : (
          <TeamSwitcher
            companies={companies!.data}
            activeCompanyId={activeCompanyId}
            isLoading={isLoadingCompanies}
          />
        )}
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
