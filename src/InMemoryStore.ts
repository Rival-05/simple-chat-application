import { Chat, Store, UserId } from "./store/Store";
let globalChatId = 0;
export interface Room{
    roomId : string;
    chats : Chat[];
}
export abstract class InMemory implements Store{
    private store : Map<string, Room>;
    constructor(){
        this.store = new Map<string, Room>;
    }
    initRooom(roomId : string){
        this.store.set(roomId ,{
            roomId,
            chats : []
        }) 
    }
    getChats(roomId : string, limit: number , offset: number){
        const room = this.store.get(roomId);
        if(!room){
            return [];
        }
        return room.chats.reverse().slice(0,offset).slice(-1 * limit);
    }
    addChat(userId: UserId,name: string, roomId : string, message : string){
        const room = this.store.get(roomId);
        if(!room){
            return;
        }
        room.chats.push({
            id : (globalChatId++).toString(),
            userId,
            name ,
            message,
            upvotes :[]
        })
    }
    upvote(userId : UserId, roomId: string, chatId: string){
        const room = this.store.get(roomId);
        if(!room){
            return;
        }
        const chat = room.chats.find(({id}) => id === chatId);
        if(chat){
            return chat.upvotes.push(userId);
        }
    }

}