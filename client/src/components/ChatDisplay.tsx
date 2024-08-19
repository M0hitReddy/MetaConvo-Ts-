import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ChatsProviderProps } from "@/contexts/ChatsContext";
import { useChats } from "@/hooks/useChats";
import { useSocket } from "@/hooks/useSocket";
import { SocketContextProps } from "@/interfaces/socketContextProps";
import { useAuth } from "@/hooks/useAuth";
import { AuthContextProps } from "@/interfaces/authContextProps";
import {
  createConversation,
  getConversation,
  getMessages,
  getTranslatedText,
} from "@/services/api";
import { ApiResponse } from "@/interfaces/apiResponse";
import { Conversation, Message } from "@/interfaces/entities";
import { MessageItems } from "./MessageItems";
import { CornerDownLeft, Mic, Paperclip } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SelectScrollable } from "./SelectScrollable";
import languages from "../utils/languages.json";
import { set } from "date-fns";
import { get } from "http";
// import { ResizablePanel } from "./ui/resizable";
// import { HomeProps } from "@/pages/Home";

export function ChatDisplay() {
  const { user }: AuthContextProps = useAuth();
  const { user_id } = useParams();
  const { chatsState, chatsDispatch }: ChatsProviderProps = useChats();
  const { sendMessage }: SocketContextProps = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [showInput, setShowInput] = useState(false);
  const[language, setLanguage] = useState<string>("original");
  //   const today = new Date();

  useEffect(() => {
    // if (!state.selectedChat || !state.selectedChat.messages) return;
    console.log(chatsState.messages);
    if (chatsState.messages.length != 0) setShowInput(true);
    // else setShowInput(false);
  }, [chatsState.selectedChat, chatsState.messages]);

  useEffect(() => {
    console.log(user_id);
    chatsDispatch({
      type: "SET_MESSAGES",
      payload: [],
    });
    setShowInput(false);

    if (!user_id) return;
    (async () => {
      try {
        if (!user) return;
        // console.log("2 times/////////////@@##$%")
        const res: { data: ApiResponse } = await getConversation(
          user.user_id,
          user_id
        );
        console.log(user.user_id, user_id);
        //  axios.get(
        //   `http://localhost:5000/chats/conversation?p1=${user.user_id}&p2=${user_id}`
        // );
        console.log(res.data);
        // chatsDispatch({ type: 'SET_MESSAGES', payload: res.data.messages || [] });
        chatsDispatch({
          type: "SELECT_CHAT",
          payload: !res.data.conversation ? null : res.data.conversation,
        });
      } catch (error) {
        console.error(error);
      }
    })();
  }, [user_id, user]);

  useLayoutEffect(() => {
    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    messagesEndRef.current?.scrollIntoView({ block: "end" });
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 200);
    // messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [user_id, showInput]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatsState.messages.length]);

  useEffect(() => {
    console.log(chatsState.selectedChat, "selected chat");
    if (
      !chatsState.selectedChat ||
      chatsState.selectedChat.conversation_id == -1
    ) {
      // dispatch({ type: "SET_MESSAGES", payload: [] });
      return;
    }
    // console.log('fetching messages')
    getSetMessages();
  }, [chatsState.selectedChat]);

  useEffect(() => {
    console.log("language changed", language);
    if(language == "original") {
      getSetMessages();
      return;
    }
    (async () => {try {
      if (chatsState.messages.length == 0) return;
      const res: {data: ApiResponse } = await getTranslatedText(language, chatsState.messages.map((message) => message.content));
      if(!res.data.translatedText) return;
      chatsDispatch({
        type: "SET_MESSAGES",
        payload: chatsState.messages.map((message, index) => ({
          ...message,
          content: res.data.translatedText?.[index] ?? message.content
        }))
      });// console.log(messages);
      // console.log(messages[0]);
    }
    catch (error) {
      console.error(error);
    }})();
  }, [language]);

  const handleStartChat = async () => {
    try {
      if (!user || !user_id) return;
      console.log("start chat", user_id, user.user_id);
      setShowInput(true);
      // dispatch({ type: "SET_MESSAGES", payload: [] });
      const res: { data: ApiResponse } = await createConversation([
        user.user_id,
        user_id,
      ]);
      //   axios.post(
      //     "http://localhost:5000/chats/conversation",
      //     { members: [user.user_id, user_id] },
      //     { withCredentials: true }
      //   );
      console.log(res.data);
      const selectedChat: Conversation = {
        ...(chatsState.selectedChat || {}),
        conversation_id: res.data.conversation_id || -1,
        user_id: user.user_id || "default-user-id", // Provide a default value
      };
      chatsDispatch({
        type: "SELECT_CHAT",
        payload: selectedChat,
      });
      // setShowInput(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      const newMessage: Message = {
        sender_id: user?.user_id ?? "",
        receiver_id: user_id,
        message_id: new Date() + "" + Math.random() * 1000,
        content: message,
        conversation_id: chatsState.selectedChat?.conversation_id ?? -1,
        sent_at: formatDate(new Date()),
        received_at: formatDate(new Date()),
        // readstatus: 0,
      };
      //   console.log(newMessage);
      //   console.log(formatDate(new Date()));
      setMessage("");
      //   chatsDispatch({ type: "ADD_MESSAGE", payload: newMessage });

      // const res = await axios.post('http://localhost:5000/chats/message', newMessage)
      console.log("sending message");
      //   socket?.emit("send-message", newMessage);
      sendMessage && sendMessage(newMessage);
      // console.log('set message')
      // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    } catch (err) {
      console.error(err);
    }
  };

  const handleLanguageChange = () => {
    // setLanguage(language);
    console.log("language changed", language);
  }
  const getSetMessages = async () => {
    try {
      // if (!chatsState.selectedChat) return;
      const res: { data: ApiResponse } = await getMessages(
        chatsState.selectedChat?.conversation_id ?? -1
      );
      // axios.get(
      //   `http://localhost:5000/chats/messages?conversationId=${state.selectedChat.conversation_id}`
      // );
      // const data = res.data.messages;
      console.log(res.data.messages);
      chatsDispatch({
        type: "SET_MESSAGES",
        payload: res.data.messages || [],
      });
      // if(state.messages.length == 0) setShowInput(false);
    } catch (error) {
      console.error(error);
    }
  }

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    const hours = `0${d.getHours()}`.slice(-2);
    const minutes = `0${d.getMinutes()}`.slice(-2);
    const seconds = `0${d.getSeconds()}`.slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  // state.messages.map((message) => console.log(message))

  return (
    <>
      {/* <ResizablePanel defaultSize={defaultLayout ? defaultLayout[2] : 655}> */}

      {chatsState.selectedChat ? (
        <div className="h-screen overflow-y- relative flex flex-grow flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-center gap-4 text-sm">
              <Avatar>
                <AvatarImage
                  src={chatsState.selectedChat.picture}
                  alt={chatsState.selectedChat.username}
                />
                <AvatarFallback>
                  {chatsState.selectedChat?.username
                    ? chatsState.selectedChat.username
                        .split(" ")
                        .map((chunk: string) => chunk.charAt(0).toUpperCase())
                        .join("")
                    : "@ @ @"
                        .split(" ")
                        .map((chunk: string) => chunk.charAt(0))
                        .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-bold text-lg">
                  {chatsState.selectedChat.username}
                </div>
              </div>
              <SelectScrollable data={languages} value={language} onChange={handleLanguageChange} setLanguage={setLanguage}/>
            </div>
            {/* {state.selectedChat.timestamp && (
              <div className="ml-auto text-xs text-muted-foreground">
              {format(new Date(state.selectedChat.timestamp), "MMM d, yyyy, h:mm a")}
              </div>
              )} */}
          </div>
          <Separator />
          {!showInput ? (
            <div className="h-full w-full flex">
              <div className="flex flex-col  gap-10 justify-center items-center w- m-auto self-center -translate-y-16 rounded-full p-10">
                <p className="text-muted-foreground tracking-wide">
                  There are no messages to be displayed
                </p>
                <Button
                  className="border border-primary rounded-full tracking-wide shadow-xl shadow-primary transition duration-100 hover:scale-105 ease-in-out"
                  onClick={() => handleStartChat()}
                >
                  Start a chat
                </Button>
              </div>
            </div>
          ) : (
            <React.Fragment>
              <div className="flex-grow"></div>
              {/* <div>hjhjvhv</div> */}
              <ScrollArea className="h-scree mr-1 flex flex-col h- justify-end ">
                <div className="flex flex-col flex-grow overflow-y-auto justify-end gap-   whitespace-pre-wrap px-16 py-4 text-sm">
                  {/* <div className="flex-grow"/> */}
                  <MessageItems />
                  <div ref={messagesEndRef}></div>
                </div>
                <ScrollBar />
              </ScrollArea>
              <Separator className="mt-auto" />
              {/* <div ref={messagesEndRef} ></div> */}
              <div className="p-4 flex flex-col gap-3 bg-background ">
                {/* <form>
                  <div className="grid gap-4">
                    <Textarea
                      className="p-4"
                      value={message}
                      onChange={(e: any) => setMessage(e.target.value)}
                      placeholder={`Reply ${chatsState.selectedChat.username}...`}
                      onKeyDown={(e: any) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                    <div className="flex items-center">
                      <Label
                        htmlFor="mute"
                        className="flex items-center gap-2 text-xs font-normal"
                      >
                        <Switch id="mute" aria-label="Mute thread" /> Mute this
                        thread
                      </Label>
                      <Button
                        disabled={message.trim() === ""}
                        onClick={(e) => handleSendMessage(e)}
                        size="sm"
                        className="ml-auto"
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </form> */}

                <form className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
                  <Label htmlFor="message" className="sr-only">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    className="min-h-12 resize-non border-0 p-3 shadow-none focus-visible:ring-0"
                    value={message}
                    onChange={(e: any) => setMessage(e.target.value)}
                    placeholder={`Reply ${chatsState.selectedChat.username}...`}
                    onKeyDown={(e: any) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  {/* <Separator /> */}
                  <div className="flex items-center p-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Paperclip className="size-4" />
                          <span className="sr-only">Attach file</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Attach File</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Mic className="size-4" />
                          <span className="sr-only">Use Microphone</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Use Microphone</TooltipContent>
                    </Tooltip>

                    <Button
                      type="submit"
                      size="sm"
                      className="ml-auto gap-1.5"
                      disabled={message.trim() === ""}
                      onClick={(e) => handleSendMessage(e)}
                    >
                      Send Message
                      <CornerDownLeft className="size-3.5" />
                    </Button>
                  </div>
                </form>
                <Label
                  htmlFor="mute"
                  className="flex items-center gap-2 text-xs font-normal"
                >
                  <Switch id="mute" aria-label="Mute thread" /> Mute this thread
                </Label>
              </div>
            </React.Fragment>
          )}
          {/* </div> */}
        </div>
      ) : (
        ""
        // <div className="p-8 text-center text-muted-foreground">
        //   No message selected
        // </div>
      )}
      {/* </div> */}
      {/* </div> */}
      {/* </ResizablePanel> */}
    </>
  );
}

// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"

// export default function Component() {
//   return (
//     <form className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
//       <Label htmlFor="message" className="sr-only">
//         Message
//       </Label>
//       <Textarea
//         id="message"
//         placeholder="Type your message here..."
//         className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
//       />
//       <div className="flex items-center p-3 pt-0">
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button variant="ghost" size="icon">
//               <Paperclip className="size-4" />
//               <span className="sr-only">Attach file</span>
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent side="top">Attach File</TooltipContent>
//         </Tooltip>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button variant="ghost" size="icon">
//               <Mic className="size-4" />
//               <span className="sr-only">Use Microphone</span>
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent side="top">Use Microphone</TooltipContent>
//         </Tooltip>
//         <Button type="submit" size="sm" className="ml-auto gap-1.5">
//           Send Message
//           <CornerDownLeft className="size-3.5" />
//         </Button>
//       </div>
//     </form>
//   );
// }
