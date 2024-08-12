import { ChatsAction, chatsContext, ChatsProviderProps } from "@/contexts/ChatsContext";
// import { ChatsContextProps } from "@/interfaces/chatsContextProps";
import { useContext } from "react";

const useChats = () => useContext<ChatsProviderProps>(chatsContext);
export { useChats };
