"use client";

import { LucideLoader } from "lucide-react";
import { useGetCompaniesByUserId } from "../api/use-get-companies";
import { useEffect, useMemo } from "react";
import { useCreateCompanyModal } from "../store/use-create-workspace-company";
import { redirect } from "next/navigation";

function CompanyRedirect({ user }: { user: any }) {
  const [open, setOpen] = useCreateCompanyModal();
  const { data: companies, isLoading } = useGetCompaniesByUserId(user.$id);

  const companyId = useMemo(() => companies?.data[0]?.$id, [companies]);

  useEffect(() => {
    if (isLoading) return;

    if (companyId) {
      redirect(`/dashboard/company/${companyId}`);
    } else {
      setOpen(true);
    }
  }, [companyId, isLoading, open, setOpen]);

  if (isLoading) {
    return <LucideLoader className="animate-spin" />;
  }

  return <>{JSON.stringify(companies, null, 2)}</>;
}

export default CompanyRedirect;
