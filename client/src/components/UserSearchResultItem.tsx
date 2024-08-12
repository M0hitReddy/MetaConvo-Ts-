import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/interfaces/entities";
import { Check } from "lucide-react";

interface UserSearchResultItemProps {
  user: User;
  onSelect: () => void;
  selectedUsers: Array<User>;
}

export function UserSearchResultItem({
  user,
  onSelect,
  selectedUsers,
}: UserSearchResultItemProps): React.ReactNode {
  return (
    <>
      <div
        className="relative  flex cursor-default select-none items-center rounded-sm px-2 py-3 text-sm hover:bg-secondary outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50"
        onClick={onSelect}
      >
        <Avatar className="h- w-">
          <AvatarImage src={user.picture} alt="Image" />
          <AvatarFallback>{user.username[0]}</AvatarFallback>
        </Avatar>
        <div className="ml-2 flex flex-col gap-2">
          <p className="text-sm font-medium leading-none">{user.username}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        {selectedUsers.map((item) => item.user_id).includes(user.user_id) ? (
          <Check className="ml-auto flex h-5 w-5 text-primary" />
        ) : null}
        {/* relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 */}
      </div>
    </>
  );
}
