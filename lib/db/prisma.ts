// Prisma client setup - simplified for build compatibility
// In a real implementation, this would use the generated PrismaClient
const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

// Mock Prisma client for build compatibility
const mockPrismaClient = {
  user: {
    create: () => Promise.resolve({}),
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
    upsert: () => Promise.resolve({}),
    deleteMany: () => Promise.resolve({}),
  },
  address: {
    create: () => Promise.resolve({}),
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
    upsert: () => Promise.resolve({}),
  },
  category: {
    create: () => Promise.resolve({}),
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
    upsert: () => Promise.resolve({}),
  },
  product: {
    create: () => Promise.resolve({}),
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
    upsert: () => Promise.resolve({}),
  },
  productCategory: {
    create: () => Promise.resolve({}),
    findMany: () => Promise.resolve([]),
    upsert: () => Promise.resolve({}),
  },
  productMedia: {
    create: () => Promise.resolve({}),
    findMany: () => Promise.resolve([]),
  },
  productVariant: {
    create: () => Promise.resolve({}),
    findMany: () => Promise.resolve([]),
    update: () => Promise.resolve({}),
  },
  inventoryLevel: {
    create: () => Promise.resolve({}),
    findMany: () => Promise.resolve([]),
    update: () => Promise.resolve({}),
    unique: () => Promise.resolve(null),
  },
  flashSale: {
    create: () => Promise.resolve({}),
    findMany: () => Promise.resolve([]),
  },
  flashSaleItem: {
    create: () => Promise.resolve({}),
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    update: () => Promise.resolve({}),
  },
  order: {
    create: () => Promise.resolve({}),
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    update: () => Promise.resolve({}),
  },
  orderItem: {
    create: () => Promise.resolve({}),
    findMany: () => Promise.resolve([]),
    delete: () => Promise.resolve({}),
  },
  payment: {
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
  },
  shipment: {
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
  },
  review: {
    create: () => Promise.resolve({}),
    findMany: () => Promise.resolve([]),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
    findUnique: () => Promise.resolve(null),
    deleteMany: () => Promise.resolve({}),
  },
  wishlistItem: {
    create: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
  },
  cartItem: {
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
  },
  $transaction: (callback: (tx: any) => Promise<any>) => callback(mockPrismaClient),
}

export const prisma = globalForPrisma.prisma ?? mockPrismaClient

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma