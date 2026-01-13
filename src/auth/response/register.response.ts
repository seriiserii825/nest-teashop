import { order } from 'src/order/response/order.response';
import { product } from 'src/product/response/product.response';
import { store } from 'src/store/response/store.response';

export const user = {
  id: 'f3b5e1c2-8c4d-4d2a-9f1e-2b6c3d4e5f6a',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  email: 'test@mail.com',
  name: 'John Doe',
  picture: '/uploads/no-user-image.png',
};

export const userWithRelations = {
  ...user,
  stores: [store, store],
  orders: [order],
  favorites: [product],
};

export const usersResponse = {
  schema: {
    example: [user],
  },
};

export const userResponse = {
  schema: {
    example: user,
  },
};

export const favoriteResponse = {
  schema: {
    example: {
      message: 'Added to favorites',
      isFavorite: true,
    },
  },
};

export const registerResponse = {
  schema: {
    example: {
      user: userWithRelations,
    },
  },
};

export const loginResponse = {
  schema: {
    example: {
      user: userWithRelations,
      accessToken: 'my token',
    },
  },
};
