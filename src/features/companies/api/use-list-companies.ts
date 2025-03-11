"use client";

import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useListAllCompanies = () => {
  const query = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const response = await client.api.companies.listAll["$get"]();
      if (!response.ok) {
        return null;
      }

      const { data } = await response.json();

      return { data };
    },
  });

  return query;
};
