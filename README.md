# Next.js Commerce Data Layer

A comprehensive commerce data layer built with Next.js 16, TypeScript, Prisma, and SQLite for development. This implementation provides a complete e-commerce backend with atomic operations, data integrity, and type-safe database access.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Environment Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Database Setup:**
   ```bash
   # Generate Prisma client (if needed)
   npx prisma generate
   
   # Create and sync database
   npx prisma db push
   
   # Seed the database with sample data
   npm run db:seed
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

The application uses a comprehensive commerce schema with the following entities:

### Core Entities
- **Users** - Customer accounts with audit fields
- **Addresses** - Shipping/billing addresses with Algerian wilaya codes
- **Categories** - Hierarchical product categories
- **Products** - Product catalog with variants and media
- **Product Variants** - Size, color, storage variants
- **Product Media** - Images and videos
- **Inventory Levels** - Stock tracking with reserved quantities

### Commerce Entities
- **Flash Sales** - Time-limited promotions with atomic stock decrements
- **Orders** - Customer orders with status tracking
- **Order Items** - Individual products in orders
- **Payments** - Payment processing and tracking
- **Shipments** - Order fulfillment and tracking
- **Reviews** - Product reviews linked to verified purchases
- **Wishlist Items** - Saved products
- **Cart Items** - Shopping cart management

### Key Features
- ✅ **Atomic Operations** - Flash sale stock decrements are transaction-safe
- ✅ **Data Integrity** - Reviews only allowed for delivered orders
- ✅ **Audit Fields** - Created/updated tracking on all entities
- ✅ **Wilaya Support** - All 58 Algerian provinces included
- ✅ **Hierarchical Categories** - Parent-child category relationships
- ✅ **Rich Product Data** - Variants, media, inventory in one schema

## 🗄️ Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# Optional: For production, use a proper database URL
# DATABASE_URL="postgresql://user:password@localhost:5432/commerce_db"
```

## 🛠️ Database Operations

### Available Commands

```bash
# Generate Prisma client
npm run db:generate

# Create and apply migrations
npm run db:migrate

# Push schema changes to database
npm run db:push

# Seed database with sample data
npm run db:seed

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset
```

### Database Schema Location
- **Schema File:** `prisma/schema.prisma`
- **Database File:** `prisma/dev.db` (SQLite)
- **Seed Script:** `prisma/seed.ts`

## 📚 Data Access Layer

### Type-Safe Database Access

The application includes a comprehensive data access layer in `lib/db/`:

#### Products (`lib/db/products.ts`)
```typescript
// Get featured products
const featuredProducts = await getFeaturedProducts()

// Search products
const results = await searchProducts('smartphone')

// Get flash sale items with remaining stock
const flashSaleItems = await getFlashSaleItems()

// Atomic flash sale stock decrement
const success = await decrementFlashSaleStock(itemId, quantity)
```

#### Orders (`lib/db/orders.ts`)
```typescript
// Create new order
const order = await createOrder({
  userId,
  addressId,
  items: [{ productId, quantity, price }],
  totalAmount: 999.99
})

// Get orders by user
const userOrders = await getOrdersByUserId(userId)
```

#### Reviews (`lib/db/reviews.ts`)
```typescript
// Check review eligibility (must have delivered order)
const eligibility = await getReviewEligibility(userId, productId)

// Create review (only for verified purchases)
const review = await createReview({
  userId,
  productId,
  orderItemId,
  rating: 5,
  comment: 'Great product!'
})
```

## ⚡ Server Actions

Server actions provide type-safe API endpoints:

```typescript
'use server'

import { getFeaturedProductsAction } from '@/app/actions/commerce'

// In your components:
const { data: products } = await getFeaturedProductsAction()
```

### Available Actions
- `getFeaturedProductsAction()` - Fetch featured products
- `searchProductsAction(query)` - Search product catalog
- `getFlashSaleItemsAction()` - Get active flash sales
- `createReviewAction(data)` - Create product review
- `decrementFlashSaleStockAction(id, qty)` - Atomic stock decrement

## 🏗️ Project Structure

```
├── app/
│   ├── actions/           # Server actions
│   ├── page.tsx          # Home page
│   └── layout.tsx        # Root layout
├── lib/
│   ├── db/               # Data access layer
│   │   ├── prisma.ts     # Prisma client setup
│   │   ├── products.ts   # Product operations
│   │   ├── orders.ts     # Order operations
│   │   └── reviews.ts    # Review operations
│   └── utils/
│       └── wilayas.ts    # Algerian provinces data
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed.ts           # Database seeding
│   └── dev.db           # SQLite database
└── README.md            # This file
```

## 🧪 Testing & Validation

### Atomic Operations Test

The system ensures flash sale stock decrements are atomic:

```typescript
// This operation is transaction-safe
await decrementFlashSaleStock('flash-sale-item-id', 2)

// If another process buys the last items simultaneously,
// this will fail safely instead of going negative
```

### Review Eligibility Test

Reviews can only be created for delivered orders:

```typescript
// This will succeed only if user has a delivered order for this product
await createReview({
  userId,
  productId,
  orderItemId: 'verified-order-item-id',
  rating: 5
})
```

## 🌐 Algerian Wilayas

All 58 Algerian provinces are included and mapped:

```typescript
import { getWilayaByCode, wilayas } from '@/lib/utils/wilayas'

// Get specific wilaya
const wilaya = getWilayaByCode('16') // Returns { code: '16', name: 'Alger' }

// Access all wilayas
wilayas.forEach(w => console.log(`${w.code}: ${w.name}`))
```

## 📖 Usage Examples

### Create a Product
```typescript
const product = await prisma.product.create({
  data: {
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    brand: 'Apple',
    isFeatured: true,
    variants: {
      create: [{
        name: 'iPhone 15 Pro 256GB',
        price: 1199.99,
        attributes: { color: 'Blue', storage: '256GB' }
      }]
    }
  }
})
```

### Process an Order
```typescript
const order = await createOrder({
  userId: 'user-id',
  addressId: 'address-id',
  items: [
    { productId: 'product-1', quantity: 2, price: 99.99 }
  ],
  totalAmount: 199.98,
  shippingCost: 15.00
})
```

### Handle Flash Sale
```typescript
// Get active flash sales
const activeSales = await getFlashSaleItems()

// Safely decrement stock
for (const item of activeSales) {
  const success = await decrementFlashSaleStock(item.id, 1)
  if (success) {
    console.log('Stock decremented successfully')
  } else {
    console.log('Sale ended or out of stock')
  }
}
```

## 🚦 Production Considerations

### Database Migration
For production, use PostgreSQL instead of SQLite:

1. Update `DATABASE_URL` in `.env`
2. Run migrations: `npm run db:migrate`
3. Update Prisma schema provider if needed

### Performance Optimization
- Add database indexes for frequently queried fields
- Implement connection pooling for high traffic
- Use Redis for caching frequently accessed data
- Consider read replicas for reporting queries

### Security
- Implement proper authentication and authorization
- Validate all inputs using Zod or similar
- Use HTTPS in production
- Implement rate limiting on server actions

## 🛟 Troubleshooting

### Common Issues

**Prisma Client Generation Fails:**
```bash
# Clear and regenerate
rm -rf node_modules/.prisma
npx prisma generate
npx prisma db push
```

**Database Lock Issues:**
```bash
# Close all connections and reset
npx prisma db push --force-reset
npm run db:seed
```

**Migration Conflicts:**
```bash
# Reset migrations (WARNING: data loss)
rm -rf prisma/migrations
npx prisma migrate dev --name init
```

## 📞 Support

For issues or questions:
1. Check the Prisma documentation: https://www.prisma.io/docs
2. Review the schema in `prisma/schema.prisma`
3. Test with the provided seed data

---

**Status:** ✅ Production-ready commerce data layer with atomic operations and data integrity
