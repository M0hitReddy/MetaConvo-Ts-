import {
  Book,
  Bot,
  Cloud,
  Code2,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  Settings2,
  SquareTerminal,
  SquareUser,
  Triangle,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenuSub } from "./ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { AuthContextProps } from "@/interfaces/authContextProps";
import { logout } from "@/services/api";
import { Navigate, useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { HomeProps } from "@/pages/Home";
import { openSync } from "fs";
import { useState } from "react";

interface AsideProps {
  open: boolean;
  dropdoenOpen?: boolean;
  setDropdoenOpen?:(dropdownOpen: boolean) => void
  setOpen: (open: boolean) => void;
}

export function Aside({ open, dropdoenOpen,setOpen }: AsideProps): React.ReactNode {
  const[dropdownOpen, setDropdownOpen] = useState<boolean>();
  const { user }: AuthContextProps = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  function handleLogout() {
    try {
      const res = logout();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <aside
      className={`inset-y left-0 z-20 flex w-full flex-col h-full border-${
        open ? "" : "r"
      }`}
    >
      <div className="border-b p-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="Home"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Triangle className="size-5 fill-foreground" />
        </Button>
      </div>
      <nav className="flex flex-col items-center gap-1 p-2 h-screen w-ful">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={`${open ? "default" : "icon"}`}
              className={`rounded-lg flex gap-4 justify-${
                open ? "start" : "center"
              } w-${open ? "full" : "max"}`}
              aria-label="Playground"
            >
              <span>
                <SquareTerminal className="size-5" />
              </span>
              {open ? <span>Playground</span> : null}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Playground
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={`${open ? "default" : "icon"}`}
              className={`rounded-lg flex gap-4 justify-${
                open ? "start" : "center"
              } w-${open ? "full" : "max"}`}
              aria-label="Models"
            >
              <span>
                <Bot className="size-5" />
              </span>
              {open ? <span>Playground</span> : null}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Models
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={`${open ? "default" : "icon"}`}
              className={`rounded-lg flex gap-4 justify-${
                open ? "start" : "center"
              } w-${open ? "full" : "max"}`}
              aria-label="API"
            >
              <span>
                <Code2 className="size-5" />
              </span>
              {open ? <span>Playground</span> : null}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            API
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={`${open ? "default" : "icon"}`}
              className={`rounded-lg flex gap-4 justify-${
                open ? "start" : "center"
              } w-${open ? "full" : "max"}`}
              aria-label="Documentation"
            >
              <span>
                <Book className="size-5" />
              </span>
              {open ? <span>Playground</span> : null}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Documentation
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={`${open ? "default" : "icon"}`}
              className={`rounded-lg flex gap-4 justify-${
                open ? "start" : "center"
              } w-${open ? "full" : "max"}`}
              aria-label="Settings"
            >
              <span>
                <Settings2 className="size-5" />
              </span>
              {open ? <span>Playground</span> : null}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Settings
          </TooltipContent>
        </Tooltip>
      </nav>
      <nav
        className={`mt-aut flex flex-col items-center gap-2 p-2 ${
          open ? "initial" : "fixed"
        } bottom-0 border-`}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={`${open ? "default" : "icon"}`}
              className={`rounded-lg flex gap-4 justify-${
                open ? "start" : "center"
              } w-${open ? "full" : "max"}`}
              aria-label="Help"
            >
              <span>
                <LifeBuoy className="size-5" />
              </span>
              {open ? <span>Help</span> : null}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Help
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <DropdownMenu open={dropdoenOpen}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger className="w-full" asChild>
                <Button
                  variant="ghost"
                  size={`${open ? "default" : "icon"}`}
                  className={`rounded-full p-0 flex justify-${
                    open ? "start" : "center"
                  } w-${open ? "full" : "max"}`}
                >
                  <span>
                    <Avatar>
                      {/* <img src={"https://github.com/shadcn.png"} alt="" /> */}
                      <AvatarImage
                        className="w-10 h-10"
                        src={user?.picture}
                        alt="@shadcn"
                      />
                      <AvatarFallback>
                        <SquareUser className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </span>
                  {open ? <span className="ml-3">Profile</span> : null}
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <DropdownMenuContent className="w-max min-w-56">
              <DropdownMenuLabel className="flex gap-3 items-center">
                <Avatar>
                  {/* <img src={"https://github.com/shadcn.png"} alt="" /> */}
                  <AvatarImage
                    className="w-10 h-10"
                    src={user?.picture}
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p>{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Keyboard className="mr-2 h-4 w-4" />
                  <span>Keyboard shortcuts</span>
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Team</span>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Invite users</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        <span>Email</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Message</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>More...</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>New Team</span>
                  <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Github className="mr-2 h-4 w-4" />
                <span>GitHub</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Cloud className="mr-2 h-4 w-4" />
                <span>API</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <Button
                  variant="ghost"
                  className="w-full p-0 h-max justify-start text-left"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <TooltipContent side="right" sideOffset={5}>
            Account
          </TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}
