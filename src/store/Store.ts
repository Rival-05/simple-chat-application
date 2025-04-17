export type UserId = string;

export interface Chat {
    id  :string;
    userId : UserId;
    name : string;
    message : string;
    upvotes : UserId[];
}
export abstract class Store{
    constructor(){

    }
    initRooom(roomId : string){

    }
    getChats(room : string, limit: number , offset: number){

    }
    addChat(userId : string , name : string,room : string, message : string){

    }
    upvote(userId : string , room: string, chatId: string){

    }

}