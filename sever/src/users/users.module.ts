import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EventsGateway } from 'src/events/events.gateway';

@Module({
  controllers: [UsersController],
  providers: [UsersService, EventsGateway],
})
export class UsersModule {}
