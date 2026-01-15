export const createProductSchema = {
  schema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      price: { type: 'number' },
      categoryId: { type: 'string' },
      colorId: { type: 'string' },
      images: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  },
};
