"use client";

import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useListAllUsers = () => {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await client.api.users.listAll["$get"]();

      if (!response.ok) {
        return null;
      }

      const { data } = await response.json();

      return { data };
    },
  });

  return query;
};
