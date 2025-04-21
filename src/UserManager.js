"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
class UserManager {
    constructor() {
        this.rooms = new Map;
        this.rooms = new Map;
    }
    addUser(name, userId, roomId, socket) {
        var _a;
        if (!this.rooms.get(roomId)) {
            this.rooms.set(roomId, {
                users: []
            });
        }
        (_a = this.rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.users.push({
            name,
            Id: userId,
            conn: socket
        });
    }
    getUser(userId, roomId) {
        var _a;
        const user = (_a = this.rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.users.find(({ Id }) => Id === userId);
        return user !== null && user !== void 0 ? user : null;
    }
    removeUser(userId, roomId) {
        var _a;
        const users = (_a = this.rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.users;
        if (users) {
            users.filter(({ Id }) => Id !== userId);
        }
    }
    broadcast(roomId, userId, message) {
        const users = this.getUser(userId, roomId);
        if (!users) {
            console.error("User not found.");
            return;
        }
        const rooms = this.rooms.get(roomId);
        if (!rooms) {
            console.error("Room not found.");
            return;
        }
        rooms.users.forEach(({ conn }) => {
            conn.sendUTF(JSON.stringify(message));
        });
    }
}
exports.UserManager = UserManager;
