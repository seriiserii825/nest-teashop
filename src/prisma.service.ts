import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMysql } from '@prisma/adapter-mysql';
import { createPool } from 'mysql2/promise';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const pool = createPool({ uri: process.env.DATABASE_URL });
    const adapter = new PrismaMysql(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
