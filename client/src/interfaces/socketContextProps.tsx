import { Socket } from "socket.io-client";
import { Message } from "./entities";

export interface SocketContextProps {
    socket: Socket | null;
    isConnected?: boolean;
    connect?: () => void;
    disconnect?: () => void;
    sendMessage?: (message: Message) => void;
    onReceiveMessage?: (callback: (message: Message) => void) => void;
}