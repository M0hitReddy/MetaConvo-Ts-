import { ChatsContextProps } from "@/interfaces/chatsContextProps";
import { Conversation, Message } from "@/interfaces/entities";
import { createContext, ReactNode, useReducer } from "react";

const initialState: ChatsContextProps = {
  chats: [],
  selectedChat: null,
  messages: [],
};
export interface ChatsProviderProps {
  chatsState: ChatsContextProps;
  chatsDispatch: React.Dispatch<ChatsAction>;
}
const chatsContext = createContext<ChatsProviderProps>({
  chatsState: initialState,
  chatsDispatch: () => null,
});

const SELECT_CHAT = "SELECT_CHAT";
const SET_CHATS = "SET_CHATS";
const SET_MESSAGES = "SET_MESSAGES";
const ADD_CHAT = "ADD_CHAT";
const ADD_MESSAGE = "ADD_MESSAGE";

export type ChatsAction =
  | { type: typeof SELECT_CHAT; payload: Conversation | null }
  | { type: typeof SET_CHATS; payload: Array<Conversation> }
  | { type: typeof SET_MESSAGES; payload: Array<Message> }
  | { type: typeof ADD_CHAT; payload: Conversation }
  | { type: typeof ADD_MESSAGE; payload: Message };

const chatsReducer = (
  state: ChatsContextProps,
  action: ChatsAction
): ChatsContextProps => {
  switch (action.type) {
    case "SELECT_CHAT":
      return {
        ...state,
        selectedChat: action.payload,
      };
    case "SET_CHATS":
      return {
        ...state,
        chats: action.payload,
      };
    case "SET_MESSAGES":
      return {
        ...state,
        messages: action.payload,
      };
    case "ADD_CHAT":
      return {
        ...state,
        chats: [...state.chats, action.payload],
      };
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    default:
      return state;
  }
};

const ChatsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // const [chats, setChats] = useState<Chat[]>([]);
  // const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  // const selectChat = (chat: Chat): void => {
  //   setSelectedChat(chat);
  // };
  // const getChats = (user_id: string): void => {
  //   // Fetch chats from the server
  // };
  const [chatsState, chatsDispatch] = useReducer(chatsReducer, initialState);

  return (
    <chatsContext.Provider
      value={{
        chatsState,
        chatsDispatch,
      }}
    >
      {children}
    </chatsContext.Provider>
  );
};

export { chatsContext, ChatsProvider };
