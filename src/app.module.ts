import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/data-source';
import { ProductModule } from './product/product.module';
import { StoreModule } from './store/store.module';
import { ColorModule } from './color/color.module';
import { CategoryModule } from './category/category.module';
import { FileModule } from './file/file.module';
import { ReviewModule } from './review/review.module';
import { OrderModule } from './order/order.module';
import { StatisticModule } from './statistic/statistic.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UserModule,
    ProductModule,
    StoreModule,
    ColorModule,
    CategoryModule,
    FileModule,
    ReviewModule,
    OrderModule,
    StatisticModule,
  ],
})
export class AppModule {}
