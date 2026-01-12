const user = {
  id: 'f3b5e1c2-8c4d-4d2a-9f1e-2b6c3d4e5f6a',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  email: 'test@mail.com',
  name: 'John Doe',
  picture: '/uploads/no-user-image.png',
  stores: [
    {
      id: '09f4f966-a81f-42ad-84f3-ed81f6e59d9f',
      createdAt: '2026-01-07T13:15:39.395Z',
      updatedAt: '2026-01-07T13:15:39.395Z',
      title: 'Venesuela',
      description: null,
      userId: '594ac722-1654-4cf4-bc3f-2f1ee6c2a24b',
    },
    {
      id: '5c831b56-901c-40d5-bb53-9c77705e38fb',
      createdAt: '2026-01-07T13:16:01.856Z',
      updatedAt: '2026-01-07T13:16:01.856Z',
      title: 'Clothes',
      description: null,
      userId: '594ac722-1654-4cf4-bc3f-2f1ee6c2a24b',
    },
  ],
  orders: [
    {
      id: '323977ea-f010-4031-a29a-b0450e47bdb7',
      createdAt: '2026-01-07T13:46:30.854Z',
      updatedAt: '2026-01-07T13:46:30.854Z',
      status: 'PENDING',
      userId: '594ac722-1654-4cf4-bc3f-2f1ee6c2a24b',
      total: 340,
    },
  ],
  favorites: [],
};

export const registerResponse = {
  schema: {
    example: {
      user,
    },
  },
};

export const loginResponse = {
  schema: {
    example: {
      user,
      accessToken: 'my token',
    },
  },
};
