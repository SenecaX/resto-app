import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpStatus,
} from '@nestjs/common';

import { MenusService } from './menus.service';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  async addMenu(
    @Body('name') menuName: string,
    @Body('description') menuDesc: string,
    @Body('price') menuPrice: number,
  ) {
    const menu = await this.menusService.insertMenu(
      menuName,
      menuDesc,
      menuPrice,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Menu added successfully',
      data: menu,
    };
  }

  @Get()
  async getAllMenus() {
    const menus = await this.menusService.getMenus();
    return menus;
  }

  @Get(':id')
  getMenu(@Param('id') menuId: string) {
    return this.menusService.getSingleMenu(menuId);
  }

  @Patch(':id')
  async updateMenu(
    @Param('id') menuId: string,
    @Body('name') menuName: string,
    @Body('description') menuDesc: string,
    @Body('price') menuPrice: number,
  ) {
    const menu = await this.menusService.updateMenu(
      menuId,
      menuName,
      menuDesc,
      menuPrice,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Menu updated successfully',
      menu: menu,
    };
  }

  @Delete(':id')
  async removeMenu(@Param('id') menuId: string) {
    const isDeleted = await this.menusService.deleteMenu(menuId);
    if (isDeleted) {
      return {
        statusCode: HttpStatus.OK,
        message: 'menu deleted successfully',
      };
    }
  }
}
