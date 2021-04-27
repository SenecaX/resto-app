import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MenusController } from './menus.controller';
import { MenusSchema } from './menus.models';
import { MenusService } from './menus.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Menu', schema: MenusSchema }])],
  controllers: [MenusController],
  providers: [MenusService],
})
export class MenusModule {}
