import { Request, Response } from 'express';

import knex from '../database/connection';

class ItemsController {
  async index(req: Request, res: Response) {
    const items = await knex('items').select('*');

    const serializedItems = items.map(item => ({
      id: item.id,
      title: item.title,
      imageUrl: `${process.env.LOCALURL}/assets/${item.image}`,
    }));

    return res.json(serializedItems);
  }
}

export default ItemsController;
