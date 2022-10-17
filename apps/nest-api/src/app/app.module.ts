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

    MongooseModule.forRoot(process.env.NX_DB_ADDRESS),
  ],

  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
