import z from "zod";

export enum SupportedMessage{
    JOIN_ROOM = "JOIN_ROOM",
    SEND_MESSAGE = "SEND_MESSAGE",
    UPVOTE_MESSAGE = "UPVOTE_MESSAGE" 
}

export type IncomingMessages = {
    type : SupportedMessage.JOIN_ROOM,
    payload : InitMessageType
} | {
    type : SupportedMessage.SEND_MESSAGE,
    payload : UserMessageType
} |{
    type : SupportedMessage.UPVOTE_MESSAGE,
    payload : UpvoteMessageType
};

export const InitMessage = z.object({
    name : z.string(),
    userId : z.string(),
    roomId : z.string()
})

export type InitMessageType = z.infer<typeof InitMessage>;

export const UserMessage = z.object({
    userId : z.string(),
    roomId : z.string(),
    message : z.string()
})

export type UserMessageType = z.infer<typeof UserMessage>;

export const UpvoteMessage = z.object({
    userId : z.string(),
    roomId : z.string(),
    chatId: z.string()
})

export type UpvoteMessageType = z.infer<typeof UpvoteMessage>;
