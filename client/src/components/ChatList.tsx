import { formatDistanceToNow } from "date-fns";

import { cn } from "@/lib/utils";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Mail } from "@/app/(app)/examples/mail/data"
// import { useChat } from "@/components/dashboard/use-chat.js"
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Conversation } from "@/interfaces/entities";
import { useAuth } from "@/hooks/useAuth";
import { AuthContextProps } from "@/interfaces/authContextProps";
import { ChatsProviderProps } from "@/contexts/ChatsContext";
import { useChats } from "@/hooks/useChats";
import { getConversations } from "@/services/api";
import { ApiResponse } from "@/interfaces/apiResponse";

interface ChatListProps {
  search: string;
  items: Array<Conversation>;
}

export function ChatList({ search, items }: ChatListProps) {
  // const [chat, setChat] = useChat()
  // console.log(items, "items");
  const navigate = useNavigate();
  const { chatsState, chatsDispatch }: ChatsProviderProps = useChats();
  const { user }: AuthContextProps = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

//   useEffect(() => {
//     if (!user) return;
//     (async () => {
//       try {
//         const res: { data: ApiResponse } = await getConversations(user.user_id);
//         console.log(res.data, "chats");
//         chatsDispatch({
//           type: "SET_CHATS",
//           payload: res.data.conversations as Array<Conversation>,
//         });
//         console.log(res.data, "chats");
//       } catch (error) {
//         console.log(error);
//       }
//     })();
//   }, []);

  const handleChatSelect = async (conv_id: number, user_id: string) => {
    // console.log(id, "id")
    // dispatch({ type: 'SELECT_CHAT', payload: { conversationID: convId, userID: userId } })
    // console.log(state.selectedChat, "selected chat")
    navigate(`/t/${user_id}`);
    // async function settMessages() {
    //   try {
    //     const res = await axios.get('http://localhost:5000/chats/messages/' + id);
    //   } catch (error) {
    //     console.error(error)
    //   }
    // }
    // dispatch({type: 'READ_CHAT', payload: id})
    // setChat({
    //   ...chat,
    //   selected: id,
    // })
  };

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-1 py-2 px-1">
        {items
          .filter((item) =>
            item.username?.toLowerCase().includes(search.toLowerCase())
          )
          .map((item) => (
            <button
              key={item.user_id}
              className={cn(
                "flex items-center gap-3 rounded-sm border- p-3 transition-all hover:bg-accent",
                chatsState.selectedChat?.conversation_id ===
                  item.conversation_id &&
                  "bg-primary text-background hover:bg-primary"
              )}
              onClick={() =>
                handleChatSelect(item.conversation_id, item.user_id)
              }
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={item.picture} alt={item.username} />
                <AvatarFallback>
                  {item?.username ??
                    "@ @ @"
                      .split(" ")
                      .map((chunk: string) => chunk[0])
                      .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-grow flex-col items-start gap-1 text-left text-sm">
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2 ">
                      <div className="font-semibold me-1 w-ma line-clamp-1 text-sm">
                        {item.username?.substring(0, 100) ??
                          "" +
                            (item.username?.length
                              ? item.username.length
                              : 0 <= 100
                              ? ""
                              : "...")}
                      </div>
                      {/* {!item.readstatus && (
                        <span className="flex h-2 w-2 rounded-full bg-blue-60" />
                      )} */}
                    </div>
                    <div
                      className={cn(
                        "ml-auto text-xs w-max",
                        chatsState.selectedChat?.conversation_id ===
                          item.conversation_id
                          ? "text-background"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.last_message_time
                        ? formatDistanceToNow(
                            new Date(
                              currentTime ? item.last_message_time : "_ _"
                            ),
                            { addSuffix: true, includeSeconds: true }
                          )
                        : "_ _"}
                    </div>
                  </div>
                  {/* <div className="text-xs font-medium">{item.content}</div> */}
                </div>
                <div className="line-clamp-1 text-s text-prima text-primay-backgr break-all">
                  <span className="font-bold">
                    {item.user_id == user?.user_id ? "You: " : ""}
                  </span>
                  {(item.last_message_content &&
                    item.last_message_content?.substring(0, 300) +
                      (item.last_message_content?.length <= 300 ? "" : "...")) ||
                    "No messages yet"}
                  {/* + "..." || "No messages yet"} */}
                </div>
              </div>
            </button>
          ))}
      </div>
    </ScrollArea>
  );
}
