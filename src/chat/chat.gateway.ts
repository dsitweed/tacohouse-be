import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(chatService: ChatService) {}
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    const { sockets } = this.server.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client id:${client.id} disconnected`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ): WsResponse<unknown> {
    return {
      event: 'message',
      data: {
        payload,
        client,
      },
    };
  }
}

/**
 * - Should use @ConnectedSocket() client: Socket when to get client information
 * - Should return a class instance that implements WsResponse
 * - Asynchronous responses: https://docs.nestjs.com/websockets/gateways#asynchronous-responses
 * # https://github.com/nestjs/nest/blob/master/sample/02-gateways/src/main.ts
 * - Adapter: Use Redis adapter
 */
