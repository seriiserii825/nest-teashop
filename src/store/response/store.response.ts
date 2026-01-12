const store = {
  id: '28aa0d16-e0b1-4754-b68f-7f076228d281',
  createdAt: '2026-01-12T18:10:25.728Z',
  updatedAt: '2026-01-12T18:10:25.728Z',
  title: 'Auto',
  description: null,
  userId: '594ac722-1654-4cf4-bc3f-2f1ee6c2a24b',
};

export const createStoreResponse = {
  schema: {
    example: {
      ...store,
      user: {
        id: '594ac722-1654-4cf4-bc3f-2f1ee6c2a24b',
      },
    },
  },
};

export const getAllStoresResponse = {
  schema: {
    example: [store],
  },
};

export const getStoreByIdResponse = {
  schema: {
    example: store,
  },
};
