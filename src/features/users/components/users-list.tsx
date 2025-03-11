"use client";

import React from "react";
import { useListAllUsers } from "../api/use-list-users";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideBan } from "lucide-react";

function UsersList() {
  const { data: users, isLoading } = useListAllUsers();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>See All users</Button>
      </SheetTrigger>
      <SheetContent className="min-w-[30svw]">
        <SheetHeader>
          <SheetTitle>Users</SheetTitle>
        </SheetHeader>
        <div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <ul className="border-t border-slate-200 mt-4 pt-4">
              {users?.data?.users.map((user) => (
                <li
                  key={user.$id}
                  className="py-2 px-4 rounded-md hover:bg-foreground/5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage>
                        <img
                          src={user.prefs.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      </AvatarImage>
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-nowrap font-bold text-sm inline-block">
                        {user.name}
                      </span>
                      <span className="inline-block text-sm">{user.email}</span>
                    </div>
                  </div>
                  <div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant={"outline"}>
                            <LucideBan size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Block User</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default UsersList;
