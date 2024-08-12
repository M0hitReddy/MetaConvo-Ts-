import { ChatsProviderProps } from "@/contexts/ChatsContext";
import { useAuth } from "@/hooks/useAuth";
import { useChats } from "@/hooks/useChats";
import { AuthContextProps } from "@/interfaces/authContextProps";
import { Message, User } from "@/interfaces/entities";
import { getTime } from "@/utils/time";
import { isPast } from "date-fns";
import React from "react";

export const MessageItems: React.FC = () => {
  const { chatsState }: ChatsProviderProps = useChats();
  const { user }: AuthContextProps = useAuth();
  return (
    <React.Fragment>
      {chatsState.messages.map((message, index) => {
        const isSameSenderAsPrevious =
          index > 0 &&
          chatsState.messages[index - 1].sender_id === message.sender_id;
        const isSameSenderAsNext =
          index < chatsState.messages.length - 1 &&
          chatsState.messages[index + 1].sender_id === message.sender_id;

        return (
          <MessageItem 
            key={message.message_id}
            message={message}
            isSameSenderAsNext={isSameSenderAsNext}
            isSameSenderAsPrevious={isSameSenderAsPrevious}
            user={user}
          />
        );
      })}
    </React.Fragment>
  );
};

interface MessageItemProps {
  message: Message;
  // key: number | string;
  isSameSenderAsNext: boolean;
  isSameSenderAsPrevious: boolean;
  user: User | null;
}

export function MessageItem({
  // key,
  message,
  isSameSenderAsNext,
  isSameSenderAsPrevious,
  user,
}: MessageItemProps): React.ReactNode {
  return (
    <div
      // key={key}  
      className={`${
        isSameSenderAsNext ? "mb-[2px]" : "mb-3"
      } w-full flex flex-col`}
    >
      <div
        className={`${
          user?.user_id === message.sender_id
            ? `self-end ${
                !isSameSenderAsPrevious && !isSameSenderAsNext
                  ? "rounded-2xl"
                  : !isSameSenderAsPrevious && isSameSenderAsNext
                  ? "rounded-br-md rounded-tr-2xl rounded-tl-2xl rounded-bl-2xl"
                  : isSameSenderAsPrevious && !isSameSenderAsNext
                  ? "rounded-br-2xl rounded-tr-md rounded-tl-2xl rounded-bl-2xl"
                  : "rounded-br-md rounded-tr-md rounded-tl-2xl rounded-bl-2xl"
              }`
            : `self-start shadow-lg bg-secondary ${
                !isSameSenderAsPrevious && !isSameSenderAsNext
                  ? "rounded-2xl"
                  : !isSameSenderAsPrevious && isSameSenderAsNext
                  ? "rounded-bl-md rounded-tr-2xl rounded-tl-2xl rounded-br-2xl"
                  : isSameSenderAsPrevious && !isSameSenderAsNext
                  ? "rounded-br-2xl rounded-tl-md rounded-tr-2xl rounded-bl-2xl"
                  : "rounded-bl-md rounded-tl-md rounded-tr-2xl rounded-br-2xl"
              }`
        } relative text-left bg-primary max-w-full sm:max-w-[90%] md:max-w-[70%] break-all flex flex-col gap-1 w-auto pt-2.5 px-3 pb-1.5 rounded-ful`}
      >
        {/* <div className="flex"> */}
        <p
          className={`text-primary-${
            user?.user_id === message.sender_id ? "foreground" : "background"
          } self-${
            user?.user_id === message.sender_id ? "end" : "start"
          } text-base font-mediu leading-none fle gap-3 tracking-wide subpixel-antialiased`}
        >
          {message.content}
          <span
            className={`text-primary-${
              user?.user_id === message.sender_id
                ? "foreground font-semibold"
                : "background"
            } opacity-60 text-xs leading-none w-max float-right ml-4 mt-2 tracking-tight self-end justify-self-end`}
          >
            {getTime(
              message.sender_id == user?.user_id
                ? message.sent_at
                : message.received_at
            )}
          </span>
        </p>
        {/* <div ref={index + 1 === state.messages.length ? messagesEndRef : null} ></div> */}
      </div>
    </div>
  );
}
