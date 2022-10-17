import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TicketModule } from './ticket/ticket.module';
import { AuthModule } from './auth/auth.module';
import { AppGateway } from './app.gateway';
import { ServeStaticModule } from '@nestjs/serve-static'; // <- INSERT LINE
import { join } from 'path'; // <- INSERT LINE
@Module({
  imports: [
    UserModule,
    TicketModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'lottery'),
      exclude: ['/api*'],
    }),
    MongooseModule.forRoot(
      'mongodb+srv://Shivam:Shivam@cluster0.orop2ex.mongodb.net/TurboLotteryDB?retryWrites=true&w=majority'
    ),
  ],

  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
