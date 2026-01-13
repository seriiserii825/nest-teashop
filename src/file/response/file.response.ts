import IFileResponse from '../interfaces/IFileResponse';

const files: IFileResponse[] = [
  {
    url: '/uploads/products/1627891234567-image1.jpg',
    name: '1627891234567-image1.jpg',
  },
  {
    url: '/uploads/products/1627891234568-image2.png',
    name: '1627891234568-image2.png',
  },
];

export const fileResponse = {
  schema: {
    example: files,
  },
};
