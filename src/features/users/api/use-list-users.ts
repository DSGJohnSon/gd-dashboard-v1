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

export const useGetUserById = (id: string) => {
  const query = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await client.api.users.getById[":userId"]["$get"]({
        param: {
          userId: id,
        },
      });

      if (!response.ok) {
        return null;
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};

export const useListUsersByIds = (ids: string[]) => {
  const queries = ids.map((id) =>
    useQuery({
      queryKey: ["user", id],
      queryFn: async () => {
        const response = await client.api.users.getById[":userId"]["$get"]({
          param: {
            userId: id,
          },
        });

        if (!response.ok) {
          return null;
        }

        const { data } = await response.json();
        return data;
      },
    })
  );

  const users = queries.map((query) => query.data);

  return { data: users, isLoading: queries.some((query) => query.isLoading) };
};
