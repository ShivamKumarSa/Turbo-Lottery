import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TicketModule } from './ticket/ticket.module';
import { AuthModule } from './auth/auth.module';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    UserModule,
    TicketModule,
    AuthModule,
    MongooseModule.forRoot(
      'mongodb+srv://Shivam:Shivam@cluster0.orop2ex.mongodb.net/TurboLotteryDB?retryWrites=true&w=majority'
    ),
  ],

  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
