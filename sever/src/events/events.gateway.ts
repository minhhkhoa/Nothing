import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000', // hoặc cấu hình domain FE
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;
  // Khi client kết nối
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // Khi client ngắt kết nối
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Ví dụ lắng nghe 1 event client gửi lên
  //- client → gửi 'ping' → server → trả 'pong'.
  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    client.emit('pong', { msg: 'pong', data });
  }

  // Hàm emit chung, có thể dùng ở bất kỳ service nào
  emitEventToAll(eventName: string, payload: any) {
    this.server.emit(eventName, payload);
  }

  // Hàm emit tới 1 client cụ thể
  emitToClient(clientId: string, eventName: string, payload: any) {
    this.server.to(clientId).emit(eventName, payload);
  }

  // Hàm emit theo room
  emitToRoom(room: string, eventName: string, payload: any) {
    this.server.to(room).emit(eventName, payload);
  }
}
