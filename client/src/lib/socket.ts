// socket.js
import { io } from "socket.io-client";
import { envConfig } from "../../config";

// URL backend socket
const SOCKET_URL = envConfig.NEXT_PUBLIC_API_URL;

export const socket = io(SOCKET_URL, {
  transports: ["websocket"], // ép dùng websocket
  autoConnect: true, // tự động kết nối khi import
  reconnection: true, // tự reconnect khi mất kết nối
  reconnectionAttempts: 5, // số lần thử reconnect
  reconnectionDelay: 1000, // delay mỗi lần reconnect (ms)
});
