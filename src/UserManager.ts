import { OutgoingMessage } from "./messages/outgoingMessages";
import { stringify } from "querystring";
import { idText } from "typescript";
import { connection } from "websocket";

interface User{
    name : string;
    Id : string;
    conn : connection
}

interface Room{
    users : User[]
}

export class UserManager{
    private rooms = new Map<string, Room>;
    constructor(){
        this.rooms = new Map<string, Room>;
    }

    addUser(name : string , userId : string , roomId : string , socket : connection){
        if(!this.rooms.get(roomId)){
            this.rooms.set(roomId, {
                users : []
            })
        }
        this.rooms.get(roomId)?.users.push({
            name ,
            Id : userId,
            conn :socket
        })
        socket.on('close', (reasonCode, description) => {
            this.removeUser(roomId,userId);
        });
    }
    getUser(userId : string , roomId : string) : User | null{
        const user = this.rooms.get(roomId)?.users.find(({Id}) => Id === userId);
        return user ?? null;
    }

    removeUser(userId : string , roomId : string){
        console.log("User Removed."); 
        const users = this.rooms.get(roomId)?.users;
        if(users){
            users.filter(({Id}) => Id !== userId);
        }
    }

    broadcast(roomId : string, userId : string, message : OutgoingMessage){
        const users = this.getUser(userId , roomId);
        if(!users){
            console.error("User not found.");
            return;
        }
        const rooms = this.rooms.get(roomId); 
        if(!rooms){
            console.error("Room not found.")
            return;
        }
        rooms.users.forEach(({conn,Id}) => {
            if(Id === userId){
                return;
            }
            console.log("outgoing message" + JSON.stringify(message));
            conn.sendUTF(JSON.stringify(message))
        })
    }
}