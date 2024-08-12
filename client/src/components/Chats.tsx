import { ResizablePanel } from "./ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { HomeProps } from "@/pages/Home";
import { useEffect, useState } from "react";
import { useChats } from "@/hooks/useChats";
import { ChatsProviderProps } from "@/contexts/ChatsContext";
import { Separator } from "./ui/separator";
import { ChatList } from "./ChatList";
import { ApiResponse } from "@/interfaces/apiResponse";
import { getConversations } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { AuthContextProps } from "@/interfaces/authContextProps";
import { Conversation } from "@/interfaces/entities";
import { NewChat } from "./NewChat";

export function Chats({defaultLayout}: HomeProps) {
  const [search, setSearch] = useState<string>("");
  const { user }: AuthContextProps = useAuth();
  // const{chatsState}: ChatsProviderProps = useChats();
  const { chatsState, chatsDispatch }: ChatsProviderProps = useChats();
  const handleSearchChange = (e: any) => {
    setSearch(e.target.value);
  };


  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res: { data: ApiResponse } = await getConversations(user.user_id);
        console.log(res.data, "chats");
        chatsDispatch({
          type: "SET_CHATS",
          payload: res.data.conversations as Array<Conversation>,
        });
        console.log(res.data, "chats");
      } catch (error) {
        console.log(error);
      }
    })();
  }, [user]);




  return (
    <ResizablePanel defaultSize={defaultLayout ? defaultLayout[1] : undefined} minSize={30}>
      <Tabs defaultValue="all">
        <div className="flex justify-between items-center px-4 py-2">
          <h1 className="text-xl font-bold">Inbox</h1>
          <div className="flex gap-3">
            <TabsList className="ml-auto">
              <TabsTrigger
                value="all"
                className="text-zinc-600 dark:text-zinc-200"
              >
                All mail
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="text-zinc-600 dark:text-zinc-200"
              >
                Unread
              </TabsTrigger>
            </TabsList>
            <NewChat />
          </div>
        </div>
        <Separator/>
        <div className="bg-background/95 py- backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <form>
            <div className="relative">
              <Search className="absolute left-3 top-[50%] -translate-y-[50%] h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => handleSearchChange(e)}
                className="pl-8 py- border-0 border-b rounded-none br-sm focus-visible:border-b-2 focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:border-b-primary"
              />
            </div>
          </form>
          {/* <Separator /> */}
        </div>
        <TabsContent value="all" className="m-0">
          <ChatList search={search} items={chatsState.chats} />
        </TabsContent>
        <TabsContent value="unread" className="m-0">
          <ChatList
            search={search}
            items={chatsState.chats.filter((item) => !item.read)}
          />
        </TabsContent>
      </Tabs>
    </ResizablePanel>
  );
}
