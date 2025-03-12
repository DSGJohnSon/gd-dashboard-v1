import React, { useEffect, useState } from "react";
import { useGetUsersByIds } from "../api/use-get-users";
import { LucideUser } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UsersSchemaReturned } from "../types";
import UsersProfilesCountSkeleton from "./skeletons/users-profiles-count-skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function UsersProfilesCount({ userIds }: { userIds: string[] }) {
  const { mutate, isPending } = useGetUsersByIds();
  const [users, setUsers] = useState<UsersSchemaReturned>({
    total: 0,
    data: [],
  });

  useEffect(() => {
    if (userIds.length > 0) {
      mutate({ userIds }, { onSuccess: (result) => setUsers(result.data) });
    }
  }, [userIds, mutate]);

  if (isPending) return <UsersProfilesCountSkeleton />;

  return (
    <div className="flex -space-x-2">
      {users.total < 3 ? (
        users.data.map((user) => {
          return (
            <span
              key={user.$id}
              className="flex items-center justify-center w-5 h-5 bg-foreground text-background rounded-full border border-background">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar className="w-full h-full object-cover">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase() || (
                          <LucideUser className="size-[1.05rem] mt-1" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>{user.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          );
        })
      ) : (
        <>
          <span className="flex items-center justify-center w-5 h-5 bg-foreground text-background rounded-full border border-background">
            <Avatar className="w-full h-full object-cover">
              <AvatarImage src={users.data[0].avatarUrl} />
              <AvatarFallback>
                {users.data[0].name.charAt(0).toUpperCase() || (
                  <LucideUser className="size-[1.05rem] mt-1" />
                )}
              </AvatarFallback>
            </Avatar>
          </span>
          <span className="flex items-center justify-center w-5 h-5 bg-foreground text-background rounded-full border border-background">
            <Avatar className="w-full h-full object-cover">
              <AvatarImage src={users.data[1].avatarUrl} />
              <AvatarFallback>
                {users.data[1].name.charAt(0).toUpperCase() || (
                  <LucideUser className="size-[1.05rem] mt-1" />
                )}
              </AvatarFallback>
            </Avatar>
          </span>
          <span className="flex items-center justify-center w-5 h-5 bg-foreground text-background text-xs rounded-full border border-background">
            {`+${users.total - 2}`}
          </span>
        </>
      )}
    </div>
  );
}

export default UsersProfilesCount;
