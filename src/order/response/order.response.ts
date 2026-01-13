export const order = {
  id: '323977ea-f010-4031-a29a-b0450e47bdb7',
  createdAt: '2026-01-07T13:46:30.854Z',
  updatedAt: '2026-01-07T13:46:30.854Z',
  status: 'PENDING',
  userId: '594ac722-1654-4cf4-bc3f-2f1ee6c2a24b',
  total: 340,
};

export const orderItem = {
  quantity: 1,
  price: 340,
  productId: '32bbfdb4-575a-4eb5-9ff1-04b6ee19c352',
  storeId: '28aa0d16-e0b1-4754-b68f-7f076228d281',
  userId: '594ac722-1654-4cf4-bc3f-2f1ee6c2a24b',
  orderId: '96ed8d22-b57f-4161-b403-115030641f8f',
  id: '2019ed60-bb59-4541-8554-9195ab6b4c07',
  createdAt: '2026-01-13T16:48:14.227Z',
  updatedAt: '2026-01-13T16:48:14.227Z',
};

export const orderFull = {
  status: 'PENDING',
  userId: '594ac722-1654-4cf4-bc3f-2f1ee6c2a24b',
  total: 340,
  id: '96ed8d22-b57f-4161-b403-115030641f8f',
  createdAt: '2026-01-13T16:48:14.227Z',
  updatedAt: '2026-01-13T16:48:14.227Z',
  orderItems: [orderItem],
};

export const orderResponse = {
  schema: {
    example: orderFull,
  },
};

export const ordersResponse = {
  schema: {
    example: [orderFull],
  },
};
