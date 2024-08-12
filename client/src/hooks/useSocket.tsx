import { SocketContext } from "@/contexts/SocketContext";
import { SocketContextProps } from "@/interfaces/socketContextProps";
import { useContext } from "react";

const useSocket = (): SocketContextProps  => useContext(SocketContext);
export { useSocket };