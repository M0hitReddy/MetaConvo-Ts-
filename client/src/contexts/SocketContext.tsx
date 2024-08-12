import {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import io from "socket.io-client";
import { Message } from "../interfaces/entities";
import { SocketContextProps } from "../interfaces/socketContextProps";
import { AuthContextProps } from "@/interfaces/authContextProps";
import { useAuth } from "@/hooks/useAuth";
import { chats } from "@/services/api";
import { useChats } from "@/hooks/useChats";
import { ChatsContextProps } from "@/interfaces/chatsContextProps";
import { ChatsProviderProps } from "./ChatsContext";

const SocketContext = createContext<SocketContextProps>({
  socket: null,
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
  sendMessage: () => {},
  onReceiveMessage: () => {},
});

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useMemo(
    () => io("http://localhost:5000", { autoConnect: false }),
    []
  ); // Replace with your server URL
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { user }: AuthContextProps = useAuth();
  const { chatsState, chatsDispatch }: ChatsProviderProps = useChats();
  useEffect(() => {
    if (user?.user_id) {
      socket.connect();
    }
    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (user?.user_id && isConnected) {
      console.log(user, "user");
      socket.emit("join", user.user_id);
    }
  }, [user, isConnected]);

  const connect = useCallback(() => {
    socket.connect();
  }, [socket]);

  const disconnect = useCallback(() => {
    socket.disconnect();
  }, [socket]);

  const sendMessage = useCallback(
    (message: Message) => {
      console.log(message);
      socket.emit("send-message", message);
      console.log(
        chatsState.chats,
        chatsState.chats.find(
          (chat) => chat.conversation_id === message.conversation_id
        ),
        "chats"
      );
      chatsDispatch({
        type: "SET_CHATS",
        payload: [
          {
            ...chatsState.chats.filter(
              (chat) => chat.conversation_id === message.conversation_id
            )[0],
            last_message_content: message.content,
            last_message_time: message.received_at,
          },
          ...chatsState.chats.filter(
            (chat) => chat.conversation_id !== message.conversation_id
          ),
        ],
      });
      chatsDispatch({
        type: "ADD_MESSAGE",
        payload: message,
      });
    },
    [socket, chatsState.chats]
  );

  // const onReceiveMessage = useCallback(
  //   [socket]
  // );
  useEffect(() => {
    const onConnect = () => {
      console.log("Connected to server");
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive-message");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("receive-message", (message: Message) => {
      console.log(message.conversation_id, chatsState.selectedChat?.conversation_id, "message");
      if(message.conversation_id === chatsState.selectedChat?.conversation_id)
      chatsDispatch({
        type: "ADD_MESSAGE",
        payload: message,
      });
      chatsDispatch({
        type: "SET_CHATS",
        payload: [
          {
            ...chatsState.chats.filter(
              (chat) => chat.conversation_id === message.conversation_id
            )[0],
            last_message_content: message.content,
            last_message_time: message.received_at,
          },
          ...chatsState.chats.filter(
            (chat) => chat.conversation_id !== message.conversation_id
          ),
        ],
      });
    });
    return () => {
      socket.off("receive-message");
    }
  }, [chatsState.chats, chatsState.selectedChat?.conversation_id]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        connect,
        disconnect,
        sendMessage,
        // onReceiveMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
