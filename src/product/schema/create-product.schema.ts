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

export const updateProductSchema = {
  schema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      price: { type: 'number' },
      categoryId: { type: 'string' },
      colorId: { type: 'string' },
      oldImages: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of existing image URLs to keep',
      },
      images: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
        description: 'New images to upload',
      },
    },
  },
};
