import { Aside } from "@/components/Aside";
import { Chats } from "@/components/Chats";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ChatsProviderProps } from "@/contexts/ChatsContext";
import { useChats } from "@/hooks/useChats";
import { useState } from "react";
// import { useSocket } from "@/hooks/useSocket";
// import { SocketContextProps } from "@/interfaces/socketContextProps";
// import { chats } from "@/services/api";
// import { Separator } from "@radix-ui/react-dropdown-menu";
// import { useCallback, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Cookies from "universal-cookie";

export interface HomeProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize?: number;
}

export function Home() {
  const cookies = new Cookies();
  const layout = cookies.get("react-resizable-panels:layout");
  // console.log(layout);
  const collapsed = cookies.get("react-resizable-panels:collapsed");
  const defaultLayout =
    layout && layout.value ? JSON.parse(layout.value) : [265, 440, 655];
  // [40, 30, 30]
  const defaultCollapsed =
    collapsed && collapsed.value ? JSON.parse(collapsed.value) : undefined;
  //########################################################
  // const {
  //   socket,
  //   isConnected,
  //   connect,
  //   disconnect,
  //   sendMessage,
  //   // onReceiveMessage,
  // }: SocketContextProps = useSocket();
  const[open, setOpen] = useState<boolean>(false);
  const[dropdownOpen, setDropdownOpen] = useState<boolean>();
  const { chatsState }: ChatsProviderProps = useChats();

  return (
    <>
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(sizes) => {
            document.cookie = `react-resizable-panels:layout=
          ${JSON.stringify(sizes)}`;
          }}
          className="h-full items-stretch"
        >
          {/* <Sheet open={open}> */}
            {/* <SheetTrigger className="outline-none" onMouseEnter={() => {setOpen(true)}}> */}
              <Aside />
            {/* </SheetTrigger> */}
            {/* <SheetContent className="outlone-none p-0" side={"left"} onMouseLeave={() => !dropdownOpen ? setOpen(false) : null}> */}
              {/* <Aside open={open} setOpen={setOpen}/> */}
            {/* </SheetContent> */}
          {/* </Sheet> */}

          <Chats defaultLayout={defaultLayout} />
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[2]}>
            <div
              className={`h-${
                chatsState.selectedChat ? "full" : "screen"
              } flex flex-col`}
            >
              {/* <div className="flex items-center p-2">
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={!state.selectedChat}
                      >
                        <Archive className="h-4 w-4" />
                        <span className="sr-only">Archive</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Archive</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={!state.selectedChat}
                      >
                        <ArchiveX className="h-4 w-4" />
                        <span className="sr-only">Move to junk</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Move to junk</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={!state.selectedChat}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Move to trash</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Move to trash</TooltipContent>
                  </Tooltip>
                  <Separator orientation="vertical" className="mx-1 h-6" />
                  <Tooltip>
                    <Popover>
                      <PopoverTrigger asChild>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={!state.selectedChat}
                          >
                            <Clock className="h-4 w-4" />
                            <span className="sr-only">Snooze</span>
                          </Button>
                        </TooltipTrigger>
                      </PopoverTrigger>
                      <PopoverContent className="flex w-[535px] p-0">
                        <div className="flex flex-col gap-2 border-r px-2 py-4">
                          <div className="px-4 text-sm font-medium">
                            Snooze until
                          </div>
                          <div className="grid min-w-[250px] gap-1">
                            <Button
                              variant="ghost"
                              className="justify-start font-normal"
                            >
                              Later today{" "}
                              <span className="ml-auto text-muted-foreground">
                                {format(addHours(today, 4), "E, h:m b")}
                              </span>
                            </Button>
                            <Button
                              variant="ghost"
                              className="justify-start font-normal"
                            >
                              Tomorrow
                              <span className="ml-auto text-muted-foreground">
                                {format(addDays(today, 1), "E, h:m b")}
                              </span>
                            </Button>
                            <Button
                              variant="ghost"
                              className="justify-start font-normal"
                            >
                              This weekend
                              <span className="ml-auto text-muted-foreground">
                                {format(nextSaturday(today), "E, h:m b")}
                              </span>
                            </Button>
                            <Button
                              variant="ghost"
                              className="justify-start font-normal"
                            >
                              Next week
                              <span className="ml-auto text-muted-foreground">
                                {format(addDays(today, 7), "E, h:m b")}
                              </span>
                            </Button>
                          </div>
                        </div>
                        <div className="p-2">
                          <Calendar />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <TooltipContent>Snooze</TooltipContent>
                  </Tooltip>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={!state.selectedChat}
                      >
                        <Reply className="h-4 w-4" />
                        <span className="sr-only">Reply</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reply</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={!state.selectedChat}
                      >
                        <ReplyAll className="h-4 w-4" />
                        <span className="sr-only">Reply all</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reply all</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={!state.selectedChat}
                      >
                        <Forward className="h-4 w-4" />
                        <span className="sr-only">Forward</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Forward</TooltipContent>
                  </Tooltip>
                </div>
                <Separator orientation="vertical" className="mx-2 h-6" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={!state.selectedChat}
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                    <DropdownMenuItem>Star thread</DropdownMenuItem>
                    <DropdownMenuItem>Add label</DropdownMenuItem>
                    <DropdownMenuItem>Mute thread</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div> */}
              {/* <Separator /> */}
              {!chatsState.selectedChat && (
                <div className="p-8 text-center text-muted-foreground">
                  No message selected
                </div>
              )}
              <Outlet />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </>
  );
}
