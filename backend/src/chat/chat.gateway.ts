import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users = new Map<string, { username: string; color: string }>(); // socket.id => { username, color }

  handleConnection(client: Socket) {
    console.log('Client connecté :', client.id);
  }
  
  handleDisconnect(client: Socket) {
    const user = this.users.get(client.id);
    if (user) {
      this.users.delete(client.id);
      this.server.emit('users', Array.from(this.users.values()));
      this.server.emit('notification', `${user.username} a quitté le chat.`);
    }
  }

  @SubscribeMessage('register')
  handleRegister(client: Socket, payload: { username: string; color: string }) {
    this.users.set(client.id, payload);
    this.server.emit('users', Array.from(this.users.values()));
    this.server.emit('notification', `${payload.username} a rejoint le chat.`);
  }

  @SubscribeMessage('typing')
  handleTyping(client: Socket, username: string) {
    client.broadcast.emit('typing', username); // ⚠️ broadcast seulement (pas au sender)
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { username: string; message: string; color: string }) {
    const message = {
      ...payload,
      timestamp: new Date().toISOString(),
    };
    this.server.emit('message', message);
  }
}
