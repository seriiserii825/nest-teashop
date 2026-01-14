import { Color } from 'src/entities/color.entity';

export interface IColorResponse {
  data: Color[];
  meta: Meta;
}
interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
