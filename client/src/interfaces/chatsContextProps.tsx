import { Conversation, Message } from "./entities";

export interface ChatsContextProps {
    chats: Array<Conversation>;
    selectedChat: Conversation | null;
    messages: Array<Message>;
    // selectChat: (chat: Chat) => void;
    // getChats: (user_id: string) => void;
}