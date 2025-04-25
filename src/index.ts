import { OutgoingMessage, SupportedMessage as OutgoingSupportedMessage } from "./messages/outgoingMessages";
import {connection, server as WebSocketServer} from "websocket"
import http from "http";
import { UserManager } from "./UserManager";
import { IncomingMessages, SupportedMessage } from "./messages/incomingMessages";
import { InMemoryStore } from "./store/InMemoryStore";

const server = http.createServer(function(request: any, response: any) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {    
    console.log((new Date()) + ' Server is listening on port 8080');
});

const userManager = new UserManager();
const store = new InMemoryStore();

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin: string) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    console.log("inside connect.")
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        console.log(message);
        //Todo add rate limiting logic here.
        if (message.type === 'utf8') {
            try{
                messageHandler(connection,JSON.parse(message.utf8Data))
            }catch(e){
            }
        }
    });
});

function messageHandler(ws : connection, message : IncomingMessages ){
    if(message.type == SupportedMessage.JOIN_ROOM){
        const payload =  message.payload;
        userManager.addUser(payload.name, payload.userId, payload.roomId, ws)
    }
    
    if(message.type == SupportedMessage.SEND_MESSAGE){
        const payload = message.payload;
        const user = userManager.getUser(payload.userId , payload.roomId);
        if(!user){
            console.error("User not found.")
            return;
        }
        let chat = store.addChat(payload.userId, user.name,payload.roomId,payload.message);
        if(!chat){
            return;
        }
        const OutgoingPayload = {
            type : OutgoingSupportedMessage.AddChat,
            payload: {
                chatId : chat.id,
                roomId : payload.roomId ,
                message : payload.message,
                name : user.name,
                upvotes : 0 
            }
        }
        userManager.broadcast(payload.roomId , payload.userId , OutgoingPayload);
    }
    
    if(message.type == SupportedMessage.UPVOTE_MESSAGE){
        const payload = message.payload;
        const chat = store.upvote(payload.userId,payload.roomId,payload.chatId);
        if(!chat){
            return;
        }
        const OutgoingPayload : OutgoingMessage= {
            type : OutgoingSupportedMessage.UpdateChat,
            payload: {
                chatId : payload.chatId,
                roomId : payload.roomId ,
                upvotes : chat.upvotes.length
            }
        }
        userManager.broadcast(payload.roomId , payload.userId , OutgoingPayload);
    }
}   