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
      {users.total < 4 ? (
        users.data.map((user) => {
          return (
            <div key={user.$id}>
              <UserProfileCircle avatarUrl={user.avatarUrl} name={user.name} />
            </div>
          );
        })
      ) : (
        <>
          <UserProfileCircle
            avatarUrl={users.data[0].avatarUrl}
            name={users.data[0].name}
          />
          <UserProfileCircle
            avatarUrl={users.data[1].avatarUrl}
            name={users.data[1].name}
          />
          <UserProfileCircle
            avatarUrl={users.data[2].avatarUrl}
            name={users.data[2].name}
          />
          <span className="flex items-center justify-center w-5 h-5 bg-foreground text-background text-xs rounded-full border border-background">
            {`+${users.total - 2}`}
          </span>
        </>
      )}
    </div>
  );
}

const UserProfileCircle = ({
  avatarUrl,
  name,
}: {
  avatarUrl?: string;
  name: string;
}) => {
  return (
    <span className="flex items-center justify-center w-5 h-5 bg-foreground text-background rounded-full border border-background">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Avatar className="w-full h-full object-cover">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>
                {name.charAt(0).toUpperCase() || (
                  <LucideUser className="size-[1.05rem] mt-1" />
                )}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>{name}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </span>
  );
};

export default UsersProfilesCount;
