import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const softDeleteModels = [
  'User',
  'Service',
  'StaffProfile',
  'ServiceCategory',
  'BlockedTime',
];

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });

    // Apply soft-delete extension
    const extended = (this as any).$extends({
      query: {
        $allModels: {
          async findMany({ model, operation, args, query }) {
            if (softDeleteModels.includes(model)) {
              args.where = { ...args.where, deletedAt: null };
            }
            return query(args);
          },
          async findFirst({ model, operation, args, query }) {
            if (softDeleteModels.includes(model)) {
              args.where = { ...args.where, deletedAt: null };
            }
            return query(args);
          },
          async findFirstOrThrow({ model, operation, args, query }) {
            if (softDeleteModels.includes(model)) {
              args.where = { ...args.where, deletedAt: null };
            }
            return query(args);
          },
          async delete({ model, operation, args, query }) {
            if (softDeleteModels.includes(model)) {
              return (this as any).update({
                ...args,
                data: { deletedAt: new Date() },
              });
            }
            return query(args);
          },
          async deleteMany({ model, operation, args, query }) {
            if (softDeleteModels.includes(model)) {
              return (this as any).updateMany({
                ...args,
                data: { deletedAt: new Date() },
              });
            }
            return query(args);
          },
        },
      },
    });

    Object.assign(this, extended);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}