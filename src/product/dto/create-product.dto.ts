export class CreateProductDto {
  title: string;
  description: string;
  price: number;
  images: any;
  storeId: string;
  categoryId?: string;
  colorId?: string;
}
