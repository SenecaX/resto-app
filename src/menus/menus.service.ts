import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Menu } from './menus.models';

@Injectable()
export class MenusService {
  constructor(@InjectModel('Menu') private readonly menuModel: Model<Menu>) {}

  async insertMenu(name: string, desc: string, price: number) {
    const newMenu = new this.menuModel({
      name,
      description: desc,
      price,
    });
    const result = await newMenu.save();
    return result;
  }

  async getMenus() {
    const menus = await this.menuModel.find().exec();
    return menus.map((menu) => ({
      id: menu.id,
      name: menu.name,
      description: menu.description,
      price: menu.price,
    }));
  }

  async getSingleMenu(menuId: string) {
    const menu = await this.findMenu(menuId);
    return {
      id: menu.id,
      name: menu.name,
      description: menu.description,
      price: menu.price,
    };
  }

  async updateMenu(menuId: string, name: string, desc: string, price: number) {
    const updateMenu = await this.findMenu(menuId);
    if (name) {
      updateMenu.name = name;
    }
    if (desc) {
      updateMenu.description = desc;
    }
    if (price) {
      updateMenu.price = price;
    }
    updateMenu.save();
    return updateMenu;
  }

  async deleteMenu(menuId: string) {
    const result = await this.menuModel.deleteOne({ _id: menuId }).exec();
    if (result.n === 0) {
      throw new NotFoundException('Could not find menu.');
    }
    return true;
  }

  private async findMenu(id: string): Promise<Menu> {
    let menu;
    try {
      menu = await this.menuModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find menu.');
    }
    if (!menu) {
      throw new NotFoundException('Could not find menu.');
    }
    return menu;
  }
}
