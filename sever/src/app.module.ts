import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EventsGateway } from './events/events.gateway';
import { NewsModule } from './news/news.module';
import { TranslationModule } from './translation/translation.module';

@Module({
  imports: [UsersModule, NewsModule, TranslationModule],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
