import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { User } from "@/interfaces/entities";
import React, { useEffect, useRef, useState } from "react";
import { Loader, Search, X } from "lucide-react";
import { getUsers } from "@/services/api";
import { ApiResponse } from "@/interfaces/apiResponse";
import { useAuth } from "@/hooks/useAuth";
import { AuthContextProps } from "@/interfaces/authContextProps";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { UserSearchResultItem } from "./UserSearchResultItem";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useNavigate } from "react-router-dom";
interface NewChatDialogProps {
  target: target;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
type target = { newChat?: true; newGroup?: true };
export function NewChatDialog({
  target,
  open,
  setOpen,
}: NewChatDialogProps): React.ReactNode {
  const [selectedUsers, setSelectedUsers] = useState<Array<User>>([]);
  const navigate = useNavigate();
  const [users, setUsers] = useState<Array<User>>([]);
  const [input, setInput] = useState<string>("");
  const { user }: AuthContextProps = useAuth();
  const [fetching, setFetching] = useState<boolean>(false);
  // const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  // console.log(target, "target");
  useEffect(() => {
    handleDialogOpenChange();
  }, [open]);

  useEffect(() => {
    if (input === "") setUsers([]);
    const delayDebounceFn = setTimeout(() => {
      if (input.trim() !== "") {
        fetchUsers(input);
      }
    }, 500); // Adjust delay as needed

    return () => clearTimeout(delayDebounceFn);
  }, [input]);

  const fetchUsers = async (searchQuery: string) => {
    setFetching(true);
    try {
      const res: { data: ApiResponse } = await getUsers(searchQuery);
      console.log(res.data);
      res.data.users = res.data.users?.filter(
        (person) => person.user_id !== user?.user_id
      );
      setTimeout(() => {
        setUsers(res.data.users as Array<User>);
        setFetching(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDialogOpenChange = () => {
    setInput("");
    setSelectedUsers([]);
    setUsers([]);
  };

  const handleOnSelect = (user: User) => {
    if (target.newChat) {
      setOpen(false);
      navigate(`/t/${user.user_id}`);
      return;
    }
    if (selectedUsers.includes(user)) {
      return setSelectedUsers(
        selectedUsers.filter((selectedUser) => selectedUser !== user)
      );
    }

    return setSelectedUsers(
      [...users].filter((u) => [...selectedUsers, user].includes(u))
    );
  };

  return (
    <>
      <div className="h-full flex flex-col">
        <DialogHeader className="px-4 pb-4 pt-5 ">
          <DialogTitle>New {target.newChat ? "chat" : "group"}</DialogTitle>
          <DialogDescription>
            {target.newChat
              ? "Select a user to start a chat with."
              : "Invite a user to this thread. This will create a new group message."}
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex relative items-center border-b py-1 px-1">
          <Search className="absolute left-3 mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder="Search for users.."
            value={input}
            onChange={(e: any) => setInput(e.target.value)}
            className="pl-8 outline-none border-none rounded-lg focus-visible:border-none focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:bg-muted"
          />
        </div>
        <React.Fragment>
          {input.trim() == "" ? (
            <div className="flex justify-center items-center flex-grow overflow-yauto">
              <p className="text-muted-foreground">
                Type to search for users
              </p>
              {/* <Loader2 */}
            </div>
          ) : fetching ? (
            <div className="flex justify-center items-center flex-grow flex overflow-y-auto">
              <Loader
                strokeWidth={"2px"}
                className="h-6 w-6 animate-spin duration-400 text-primary"
              />
              {/* <Loader2 */}
            </div>
          ) : (
            <ScrollArea className="flex flex-grow overflow-y-auto">
              {users.length == 0 ? (
                <p className="ml-8 mt-6 text-muted-foreground">No users found</p>
              ) : (
                <div className="p-2 flex flex-col overflow-y-uto w-full">
                  {users.map((user) => (
                    <UserSearchResultItem
                      key={user.user_id}
                      user={user}
                      onSelect={() => handleOnSelect(user)}
                      selectedUsers={selectedUsers} // this is the prop that is not updating
                    />
                  ))}
                </div>
              )}
              <ScrollBar />
            </ScrollArea>
          )}
        </React.Fragment>

        {target.newGroup && (
          <DialogFooter
            className={`flex relative items-center border-t px-3 py-${
              selectedUsers.length > 0 ? 1 : 6
            } sm:justify-between`}
          >
            {selectedUsers.length > 0 ? (
              <ScrollArea className="w-96 group/scroll max-w-[70 min-h52 borde rounded-full">
                <div className="flex w-max -space-x-4 py-3 group-hover:py-4">
                  {selectedUsers.map((user) => (
                    <Tooltip key={user.user_id}>
                      <TooltipTrigger
                        className="group-hover/scroll:ml-0 transition-all duration-200  hover:scale-105"
                        onClick={() => {
                          setSelectedUsers(
                            selectedUsers.filter(
                              (selectedUser) => selectedUser !== user
                            )
                          );
                        }}
                        asChild
                      >
                        <div className="relative image inline-block">
                          <Avatar className="inline-block group/image border-2 w-12 h-12 border-background">
                            <AvatarImage src={user.picture} />
                            <AvatarFallback>{user.username[0]}</AvatarFallback>
                            <X className="absolute bg-white inset-0 w-full h-full opacity-0 text-black z-10 group-hover/image:opacity-90 transition-opacity duration-300" />
                          </Avatar>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{user.username}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select users to add to this thread.
              </p>
            )}
            <Button
              disabled={selectedUsers.length < 2}
              onClick={() => {
                setOpen(false);
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        )}
      </div>
    </>
  );
}

// The input is changing and users are being fetched correctly,BUT the comboItems are not updating and facing unexpected behaviour. Is there any other component with same UI? Or is there any fix for this. I tried changing so many times but still not working?
