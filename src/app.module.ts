import { OrdersModule } from './orders/orders.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    OrdersModule,
    MongooseModule.forRoot('mongodb://localhost/resto_db'),
  ],
  controllers: [AppController],
  exports: [],
  providers: [AppService],
})
export class AppModule {}
