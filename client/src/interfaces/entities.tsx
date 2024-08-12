export interface User {
    user_id: string
    username: string
    email: string
    password_hash?: string
    picture?: string
    createdAt?: string
    updatedAt?: string
}

export interface Message {
    message_id: number | string
    conversation_id: number
    content: string
    sender_id: string
    receiver_id?: string
    sent_at: string
    received_at: string
    createdAt?: string
    updatedAt?: string
}

export interface Conversation {
    read?: boolean
    picture?: string
    last_message_time?: string
    first_message_time?: string
    last_message_content?: string
    username?: string
    user_id: string
    last_message_sender_id?: string
    conversation_id: number | -1
    createdAt?: string
    updatedAt?: string
}

// export interface Chat {
//     read?: boolean
//     picture?: string
//     last_message_time?: string
//     last_message?: string
//     username: string
//     user_id: string
//     conversation_id: number
// }


