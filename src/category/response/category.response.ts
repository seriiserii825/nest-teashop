const category = {
  id: '3a890915-8112-4076-a820-c19651d1a115',
  createdAt: '2026-01-12T18:48:46.596Z',
  updatedAt: '2026-01-12T18:48:46.596Z',
  title: 'Movies',
  description: 'Phones for sell',
  storeId: '28aa0d16-e0b1-4754-b68f-7f076228d281',
};

export const createCategoryResponse = {
  schema: {
    example: category,
  },
};

export const categoriesResponse = {
  schema: {
    example: [category, category, category],
  },
};
