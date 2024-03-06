import { INestApplicationContext, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interface';
import { ConfigService } from '@nestjs/config';

export class SocketIoAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIoAdapter.name);

  constructor(private app: INestApplicationContext) {
    super(app);
  }

  private readonly configService = this.app.get(ConfigService);

  createIOServer(port: number, options?: ServerOptions) {
    // const clientPort = this.configService.get<number>('SOCKETIO_SERVER_PORT');

    const cors = {
      origin: '*',
    };

    this.logger.log(
      `Configuring SocketIO server with custom CORS options ${JSON.stringify(
        cors,
      )}`,
    );

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };

    const jwtService = this.app.get(JwtService);
    const server: Server = super.createIOServer(port, optionsWithCORS);

    server.use(this.createTokenMiddleware(jwtService, this.logger));

    return server;
  }

  createTokenMiddleware =
    (jwtService: JwtService, logger: Logger) =>
    (socket: Socket & JwtPayload, next: (err?: any) => void) => {
      // for Postman testing support, fallback to token header
      const token =
        socket.handshake.auth.token || socket.handshake.headers['token'];

      socket.handshake.headers.authorization;

      logger.debug(`Validating auth token before connection: ${token}`);

      try {
        if (!token) {
          throw new Error('Token not provided');
        }

        const payload: JwtPayload = jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        });

        socket.userId = payload.userId;

        next();
      } catch (error) {
        logger.error(`Error validating auth token: ${error.message}`);
        next(new Error('FORBIDDEN'));
      }
    };
}
