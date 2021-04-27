import { OrderModule } from './order/order.module';
import { MenusModule } from './menus/menus.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MenusModule,
    OrderModule,
    MongooseModule.forRoot('mongodb://localhost/resto_db'),
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
  ],
  controllers: [AppController],
  exports: [],
  providers: [AppService],
})
export class AppModule {}
