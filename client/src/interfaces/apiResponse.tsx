import { Conversation, Message, User } from "./entities"

export interface ApiResponse {
    success: boolean
    messageAck: string
    user?: User
    users?: Array<User>
    token?: string
    message?: Message
    messages?: Array<Message>
    conversation?: Conversation
    conversation_id?: number
    conversations?: Array<Conversation>
    translatedText?: Array<string>
    url?: string
}