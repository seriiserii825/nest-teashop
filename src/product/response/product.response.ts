const product = {
  id: '32bbfdb4-575a-4eb5-9ff1-04b6ee19c352',
  createdAt: '2026-01-12T17:46:32.230Z',
  updatedAt: '2026-01-12T17:46:32.230Z',
  title: 'product 6',
  description: 'Product 1 description',
  price: 36899,
  images: ['/uploads/products/1.jpg', '/uploads/products/2.jpg'],
  storeId: '5c831b56-901c-40d5-bb53-9c77705e38fb',
  categoryId: 'e667b8dc-7a96-40cc-891a-0d9c60e9e5a7',
  colorId: 'c9626a27-7f46-4bf0-a177-ffa2a9d7c580',
  userId: null,
};

export const createProductResponse = {
  schema: {
    example: product,
  },
};

export const getAllProductsResponse = {
  schema: {
    example: {
      data: [
        {
          id: '32bbfdb4-575a-4eb5-9ff1-04b6ee19c352',
          createdAt: '2026-01-12T17:46:32.230Z',
          updatedAt: '2026-01-12T17:46:32.230Z',
          title: 'product 6',
          description: 'Product 1 description',
          price: 36899,
          images: ['/uploads/products/1.jpg', '/uploads/products/2.jpg'],
          storeId: '5c831b56-901c-40d5-bb53-9c77705e38fb',
          categoryId: 'e667b8dc-7a96-40cc-891a-0d9c60e9e5a7',
          category: {
            id: 'e667b8dc-7a96-40cc-891a-0d9c60e9e5a7',
            createdAt: '2026-01-12T17:46:11.157Z',
            updatedAt: '2026-01-12T17:46:11.157Z',
            title: 'Tv',
            description: 'Phones for sell',
            storeId: '5c831b56-901c-40d5-bb53-9c77705e38fb',
          },
          colorId: 'c9626a27-7f46-4bf0-a177-ffa2a9d7c580',
          color: {
            id: 'c9626a27-7f46-4bf0-a177-ffa2a9d7c580',
            createdAt: '2026-01-12T17:46:19.075Z',
            updatedAt: '2026-01-12T17:46:19.075Z',
            name: 'Orange',
            value: '#f32',
            storeId: '5c831b56-901c-40d5-bb53-9c77705e38fb',
          },
          userId: null,
        },
      ],
      meta: {
        total: 2,
        page: 1,
        limit: 5,
        totalPages: 1,
      },
    },
  },
};

export const getProductsByCategoryIdResponse = {
  schema: {
    example: [product],
  },
};

export const getProductByIdResponse = {
  schema: {
    example: product,
  },
};
