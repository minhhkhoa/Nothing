// socket.js
import { io, Socket } from "socket.io-client";
import { envConfig } from "../../config";
import { User } from "@/schema/user.schema";

// URL backend socket
const SOCKET_URL = envConfig.NEXT_PUBLIC_API_URL;

//- define type
interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: boolean) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  create_user: (user: User) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

//- define type socket
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  SOCKET_URL,
  {
    transports: ["websocket"], // ép dùng websocket
    autoConnect: true, // tự động kết nối khi import
    reconnection: true, // tự reconnect khi mất kết nối
    reconnectionAttempts: 5, // số lần thử reconnect
    reconnectionDelay: 1000, // delay mỗi lần reconnect (ms)
  }
);
