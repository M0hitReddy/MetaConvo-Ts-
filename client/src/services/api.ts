import { Message } from "@/interfaces/entities";
import axios from "axios";

export const auth = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true,
});

export const chats = axios.create({
  baseURL: "http://localhost:5000/api/chats",
  withCredentials: true,
});

const getToken = (searchParams: string) => {
  return auth.get(`/token${searchParams}`);
};

const logout = () => {
  return auth.post("logout");
};

const getUser = () => {
  return auth.get("/logged_in");
};

const getUrl = () => {
  return auth.get("/url");
};

const getMessages = (conversation_id: number) => {
  return chats.get(`/messages?conversation_id=${conversation_id}`);
};

const getUsers = (search: string) => {
  return chats.get(`/users?search=${search}`);
};

const createConversation = (members: Array<string>) => {
  return chats.post("/conversation", { members });
};

const getConversations = (user_id: string) => {
  return chats.get(`/conversations?user_id=${user_id}`);
};

const getConversation = (person1: string, person2: string) => {
  return chats.get(`/conversation?person1=${person1}&person2=${person2}`);
};

const sendMessage = (message: Message) => {
  return chats.post("/message", message);
};

const getTranslatedText = (target: string, text: Array<string>) => {
  return chats.post("/translate", { target, text });
};

export {
  getToken,
  logout,
  getUser,
  getUrl,
  getMessages,
  getUsers,
  createConversation,
  getConversations,
  getConversation,
  sendMessage,
  getTranslatedText,
};
