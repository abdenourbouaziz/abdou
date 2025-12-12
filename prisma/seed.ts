import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'clothing' },
      update: {},
      create: {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'home-garden' },
      update: {},
      create: {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home improvement and garden supplies',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sports-outdoors' },
      update: {},
      create: {
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors',
        description: 'Sports equipment and outdoor gear',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'books-media' },
      update: {},
      create: {
        name: 'Books & Media',
        slug: 'books-media',
        description: 'Books, magazines, and digital media',
      },
    }),
  ])

  console.log('✅ Categories created')

  // Create users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'ahmed.benali@email.com' },
      update: {},
      create: {
        email: 'ahmed.benali@email.com',
        firstName: 'Ahmed',
        lastName: 'Benali',
        phone: '+213555123456',
      },
    }),
    prisma.user.upsert({
      where: { email: 'fatima.zahra@email.com' },
      update: {},
      create: {
        email: 'fatima.zahra@email.com',
        firstName: 'Fatima',
        lastName: 'Zahra',
        phone: '+213555789012',
      },
    }),
    prisma.user.upsert({
      where: { email: 'omar.haddad@email.com' },
      update: {},
      create: {
        email: 'omar.haddad@email.com',
        firstName: 'Omar',
        lastName: 'Haddad',
        phone: '+213555345678',
      },
    }),
  ])

  console.log('✅ Users created')

  // Create addresses with wilayas
  const addresses = await Promise.all([
    prisma.address.create({
      data: {
        userId: users[0].id,
        type: 'shipping',
        firstName: 'Ahmed',
        lastName: 'Benali',
        street: '123 Rue Didouche Mourad',
        city: 'Algiers',
        wilayaCode: '16',
        wilayaName: 'Alger',
        postalCode: '16000',
        phone: '+213555123456',
        isDefault: true,
      },
    }),
    prisma.address.create({
      data: {
        userId: users[1].id,
        type: 'shipping',
        firstName: 'Fatima',
        lastName: 'Zahra',
        street: '456 Avenue Mohamed V',
        city: 'Oran',
        wilayaCode: '31',
        wilayaName: 'Oran',
        postalCode: '31000',
        phone: '+213555789012',
        isDefault: true,
      },
    }),
    prisma.address.create({
      data: {
        userId: users[2].id,
        type: 'shipping',
        firstName: 'Omar',
        lastName: 'Haddad',
        street: '789 Boulevard Said Hamdine',
        city: 'Constantine',
        wilayaCode: '25',
        wilayaName: 'Constantine',
        postalCode: '25000',
        phone: '+213555345678',
        isDefault: true,
      },
    }),
  ])

  console.log('✅ Addresses created')

  // Create products
  const products = await Promise.all([
    // Electronics
    prisma.product.upsert({
      where: { slug: 'samsung-galaxy-s24' },
      update: {},
      create: {
        name: 'Samsung Galaxy S24',
        slug: 'samsung-galaxy-s24',
        description: 'Latest Samsung flagship smartphone with advanced AI features',
        brand: 'Samsung',
        sku: 'SGS24-BLK-256',
        isActive: true,
        isFeatured: true,
        weight: 0.168,
        dimensions: JSON.stringify({ length: 14.7, width: 7.06, height: 0.79 }),
      },
    }),
    prisma.product.upsert({
      where: { slug: 'iphone-15-pro' },
      update: {},
      create: {
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        description: 'Apple iPhone 15 Pro with titanium design and A17 Pro chip',
        brand: 'Apple',
        sku: 'IP15P-BLU-128',
        isActive: true,
        isFeatured: true,
        weight: 0.187,
        dimensions: JSON.stringify({ length: 14.67, width: 7.08, height: 0.83 }),
      },
    }),
    prisma.product.upsert({
      where: { slug: 'macbook-air-m3' },
      update: {},
      create: {
        name: 'MacBook Air M3',
        slug: 'macbook-air-m3',
        description: 'Apple MacBook Air with M3 chip, 13-inch display',
        brand: 'Apple',
        sku: 'MBA-M3-SLV-256',
        isActive: true,
        isFeatured: true,
        weight: 1.24,
        dimensions: JSON.stringify({ length: 30.41, width: 21.5, height: 1.13 }),
      },
    }),

    // Clothing
    prisma.product.upsert({
      where: { slug: 'mens-cotton-shirt' },
      update: {},
      create: {
        name: 'Men\'s Cotton Dress Shirt',
        slug: 'mens-cotton-shirt',
        description: 'Premium cotton dress shirt for men, slim fit',
        brand: 'FashionCo',
        sku: 'MCS-WHT-L',
        isActive: true,
        isFeatured: true,
        weight: 0.3,
        dimensions: JSON.stringify({ length: 75, width: 60, height: 2 }),
      },
    }),
    prisma.product.upsert({
      where: { slug: 'womens-summer-dress' },
      update: {},
      create: {
        name: 'Women\'s Summer Dress',
        slug: 'womens-summer-dress',
        description: 'Lightweight summer dress perfect for warm weather',
        brand: 'StyleNow',
        sku: 'WSD-FLW-M',
        isActive: true,
        isFeatured: false,
        weight: 0.2,
        dimensions: JSON.stringify({ length: 90, width: 50, height: 3 }),
      },
    }),

    // Home & Garden
    prisma.product.upsert({
      where: { slug: 'coffee-maker-pro' },
      update: {},
      create: {
        name: 'Professional Coffee Maker',
        slug: 'coffee-maker-pro',
        description: 'High-end programmable coffee maker with built-in grinder',
        brand: 'BrewMaster',
        sku: 'CMP-STD-BLK',
        isActive: true,
        isFeatured: true,
        weight: 3.5,
        dimensions: JSON.stringify({ length: 35, width: 20, height: 40 }),
      },
    }),
    prisma.product.upsert({
      where: { slug: 'indoor-plant-set' },
      update: {},
      create: {
        name: 'Indoor Plant Collection',
        slug: 'indoor-plant-set',
        description: 'Set of 3 low-maintenance indoor plants with decorative pots',
        brand: 'GreenLife',
        sku: 'IPS-SET-3',
        isActive: true,
        isFeatured: false,
        weight: 2.0,
        dimensions: JSON.stringify({ length: 30, width: 30, height: 60 }),
      },
    }),

    // Sports & Outdoors
    prisma.product.upsert({
      where: { slug: 'yoga-mat-premium' },
      update: {},
      create: {
        name: 'Premium Yoga Mat',
        slug: 'yoga-mat-premium',
        description: 'Non-slip premium yoga mat with carrying strap',
        brand: 'FitLife',
        sdk: 'YMP-STD-PUR',
        isActive: true,
        isFeatured: false,
        weight: 1.2,
        dimensions: JSON.stringify({ length: 183, width: 61, height: 0.6 }),
      },
    }),
    prisma.product.upsert({
      where: { slug: 'hiking-backpack-40l' },
      update: {},
      create: {
        name: 'Hiking Backpack 40L',
        slug: 'hiking-backpack-40l',
        description: 'Durable 40-liter hiking backpack with multiple compartments',
        brand: 'AdventureGear',
        sku: 'HB40L-BLU-OS',
        isActive: true,
        isFeatured: true,
        weight: 1.8,
        dimensions: JSON.stringify({ length: 65, width: 30, height: 25 }),
      },
    }),

    // Books & Media
    prisma.product.upsert({
      where: { slug: 'programming-typescript-book' },
      update: {},
      create: {
        name: 'TypeScript Programming Guide',
        slug: 'programming-typescript-book',
        description: 'Comprehensive guide to TypeScript programming language',
        brand: 'TechBooks',
        sku: 'PTG-PAP-2024',
        isActive: true,
        isFeatured: false,
        weight: 0.5,
        dimensions: JSON.stringify({ length: 23, width: 18, height: 2 }),
      },
    }),
    prisma.product.upsert({
      where: { slug: 'wireless-headphones' },
      update: {},
      create: {
        name: 'Wireless Noise-Cancelling Headphones',
        slug: 'wireless-headphones',
        description: 'Premium wireless headphones with active noise cancellation',
        brand: 'AudioTech',
        sku: 'WH-NC-BLK',
        isActive: true,
        isFeatured: true,
        weight: 0.25,
        dimensions: JSON.stringify({ length: 18, width: 15, height: 8 }),
      },
    }),
  ])

  console.log('✅ Products created')

  // Link products to categories
  const productCategories = [
    { productId: products[0].id, categoryId: categories[0].id }, // Samsung Galaxy -> Electronics
    { productId: products[1].id, categoryId: categories[0].id }, // iPhone -> Electronics
    { productId: products[2].id, categoryId: categories[0].id }, // MacBook -> Electronics
    { productId: products[3].id, categoryId: categories[1].id }, // Men's shirt -> Clothing
    { productId: products[4].id, categoryId: categories[1].id }, // Women's dress -> Clothing
    { productId: products[5].id, categoryId: categories[2].id }, // Coffee maker -> Home & Garden
    { productId: products[6].id, categoryId: categories[2].id }, // Plants -> Home & Garden
    { productId: products[7].id, categoryId: categories[3].id }, // Yoga mat -> Sports
    { productId: products[8].id, categoryId: categories[3].id }, // Backpack -> Sports
    { productId: products[9].id, categoryId: categories[4].id }, // Book -> Books
    { productId: products[10].id, categoryId: categories[4].id }, // Headphones -> Books (media)
  ]

  await Promise.all(
    productCategories.map((pc) =>
      prisma.productCategory.upsert({
        where: {
          productId_categoryId: {
            productId: pc.productId,
            categoryId: pc.categoryId,
          },
        },
        update: {},
        create: pc,
      })
    )
  )

  console.log('✅ Product categories linked')

  // Create product variants
  const variants = await Promise.all([
    // Samsung Galaxy S24 variants
    prisma.productVariant.create({
      data: {
        productId: products[0].id,
        name: 'Galaxy S24 256GB Black',
        sku: 'SGS24-BLK-256',
        price: 89999.99,
        comparePrice: 99999.99,
        attributes: JSON.stringify({ color: 'Black', storage: '256GB', ram: '8GB' }),
      },
    }),
    prisma.productVariant.create({
      data: {
        productId: products[0].id,
        name: 'Galaxy S24 512GB Blue',
        sku: 'SGS24-BLU-512',
        price: 109999.99,
        comparePrice: 119999.99,
        attributes: JSON.stringify({ color: 'Blue', storage: '512GB', ram: '12GB' }),
      },
    }),

    // iPhone 15 Pro variants
    prisma.productVariant.create({
      data: {
        productId: products[1].id,
        name: 'iPhone 15 Pro 128GB Blue',
        sku: 'IP15P-BLU-128',
        price: 119999.99,
        comparePrice: 129999.99,
        attributes: JSON.stringify({ color: 'Blue', storage: '128GB', ram: '8GB' }),
      },
    }),
    prisma.productVariant.create({
      data: {
        productId: products[1].id,
        name: 'iPhone 15 Pro 256GB Natural',
        sku: 'IP15P-NAT-256',
        price: 134999.99,
        comparePrice: 144999.99,
        attributes: JSON.stringify({ color: 'Natural', storage: '256GB', ram: '8GB' }),
      },
    }),

    // MacBook Air M3 variants
    prisma.productVariant.create({
      data: {
        productId: products[2].id,
        name: 'MacBook Air M3 256GB Silver',
        sku: 'MBA-M3-SLV-256',
        price: 159999.99,
        comparePrice: 169999.99,
        attributes: JSON.stringify({ color: 'Silver', storage: '256GB', ram: '8GB', chip: 'M3' }),
      },
    }),

    // Clothing variants
    prisma.productVariant.create({
      data: {
        productId: products[3].id,
        name: 'Men\'s Shirt Large White',
        sku: 'MCS-WHT-L',
        price: 4999.99,
        comparePrice: 5999.99,
        attributes: JSON.stringify({ color: 'White', size: 'L', material: 'Cotton' }),
      },
    }),
    prisma.productVariant.create({
      data: {
        productId: products[3].id,
        name: 'Men\'s Shirt Medium Blue',
        sku: 'MCS-BLU-M',
        price: 4999.99,
        comparePrice: 5999.99,
        attributes: JSON.stringify({ color: 'Blue', size: 'M', material: 'Cotton' }),
      },
    }),

    // More variants for other products...
    prisma.productVariant.create({
      data: {
        productId: products[5].id,
        name: 'Coffee Maker Standard Black',
        sku: 'CMP-STD-BLK',
        price: 24999.99,
        comparePrice: 29999.99,
        attributes: JSON.stringify({ color: 'Black', capacity: '12-cup', features: 'Programmable' }),
      },
    }),
    prisma.productVariant.create({
      data: {
        productId: products[8].id,
        name: 'Hiking Backpack 40L Blue',
        sku: 'HB40L-BLU-OS',
        price: 14999.99,
        comparePrice: 17999.99,
        attributes: JSON.stringify({ color: 'Blue', capacity: '40L', size: 'One Size' }),
      },
    }),
  ])

  console.log('✅ Product variants created')

  // Create product media
  const mediaItems = [
    // Samsung Galaxy S24 media
    {
      productId: products[0].id,
      url: '/images/products/samsung-galaxy-s24-1.jpg',
      alt: 'Samsung Galaxy S24 front view',
      type: 'image',
      order: 0,
    },
    {
      productId: products[0].id,
      url: '/images/products/samsung-galaxy-s24-2.jpg',
      alt: 'Samsung Galaxy S24 back view',
      type: 'image',
      order: 1,
    },

    // iPhone 15 Pro media
    {
      productId: products[1].id,
      url: '/images/products/iphone-15-pro-1.jpg',
      alt: 'iPhone 15 Pro front view',
      type: 'image',
      order: 0,
    },

    // MacBook Air M3 media
    {
      productId: products[2].id,
      url: '/images/products/macbook-air-m3-1.jpg',
      alt: 'MacBook Air M3 open view',
      type: 'image',
      order: 0,
    },

    // More media items...
  ]

  await Promise.all(
    mediaItems.map((item) =>
      prisma.productMedia.create({
        data: item,
      })
    )
  )

  console.log('✅ Product media created')

  // Create inventory levels
  const inventoryItems = [
    // Samsung Galaxy S24 inventory
    {
      productId: products[0].id,
      productVariantId: variants[0].id,
      quantity: 25,
      lowStockThreshold: 5,
    },
    {
      productId: products[0].id,
      productVariantId: variants[1].id,
      quantity: 15,
      lowStockThreshold: 5,
    },

    // iPhone 15 Pro inventory
    {
      productId: products[1].id,
      productVariantId: variants[2].id,
      quantity: 30,
      lowStockThreshold: 5,
    },
    {
      productId: products[1].id,
      productVariantId: variants[3].id,
      quantity: 20,
      lowStockThreshold: 5,
    },

    // MacBook Air M3 inventory
    {
      productId: products[2].id,
      productVariantId: variants[4].id,
      quantity: 10,
      lowStockThreshold: 3,
    },

    // Clothing inventory
    {
      productId: products[3].id,
      productVariantId: variants[5].id,
      quantity: 50,
      lowStockThreshold: 10,
    },
    {
      productId: products[3].id,
      productVariantId: variants[6].id,
      quantity: 40,
      lowStockThreshold: 10,
    },

    // Other products inventory (base products without variants)
    {
      productId: products[4].id,
      quantity: 35,
      lowStockThreshold: 5,
    },
    {
      productId: products[5].id,
      productVariantId: variants[7].id,
      quantity: 12,
      lowStockThreshold: 3,
    },
    {
      productId: products[8].id,
      productVariantId: variants[8].id,
      quantity: 18,
      lowStockThreshold: 5,
    },
  ]

  await Promise.all(
    inventoryItems.map((item) =>
      prisma.inventoryLevel.create({
        data: item,
      })
    )
  )

  console.log('✅ Inventory levels created')

  // Create flash sale
  const flashSale = await prisma.flashSale.create({
    data: {
      name: 'Flash Sale - Electronics',
      description: 'Limited time offers on selected electronics',
      startTime: new Date(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      isActive: true,
    },
  })

  // Create flash sale items
  const flashSaleItems = [
    {
      flashSaleId: flashSale.id,
      productId: products[0].id, // Samsung Galaxy
      productVariantId: variants[0].id,
      discountPrice: 79999.99,
      maxQuantity: 10,
      soldQuantity: 2,
    },
    {
      flashSaleId: flashSale.id,
      productId: products[1].id, // iPhone
      productVariantId: variants[2].id,
      discountPrice: 109999.99,
      maxQuantity: 15,
      soldQuantity: 5,
    },
    {
      flashSaleId: flashSale.id,
      productId: products[8].id, // Backpack
      productVariantId: variants[8].id,
      discountPrice: 11999.99,
      maxQuantity: 8,
      soldQuantity: 1,
    },
  ]

  await Promise.all(
    flashSaleItems.map((item) =>
      prisma.flashSaleItem.create({
        data: item,
      })
    )
  )

  console.log('✅ Flash sale created')

  // Create some orders with delivered status
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        userId: users[0].id,
        addressId: addresses[0].id,
        orderNumber: 'ORD-2024-001',
        status: 'delivered',
        totalAmount: 89999.99,
        shippingCost: 1500.00,
        taxAmount: 17100.00,
        items: {
          create: [
            {
              productId: products[0].id,
              productVariantId: variants[0].id,
              quantity: 1,
              price: 89999.99,
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        userId: users[1].id,
        addressId: addresses[1].id,
        orderNumber: 'ORD-2024-002',
        status: 'delivered',
        totalAmount: 24999.99,
        shippingCost: 1000.00,
        taxAmount: 4740.00,
        items: {
          create: [
            {
              productId: products[5].id,
              productVariantId: variants[7].id,
              quantity: 1,
              price: 24999.99,
            },
          ],
        },
      },
    }),
  ])

  console.log('✅ Orders created')

  // Create some reviews
  await Promise.all([
    prisma.review.create({
      data: {
        userId: users[0].id,
        productId: products[0].id,
        orderItemId: orders[0].items[0].id,
        rating: 5,
        title: 'Excellent phone!',
        comment: 'Great features and battery life. Highly recommended.',
        isVerified: true,
        isPublished: true,
      },
    }),
    prisma.review.create({
      data: {
        userId: users[1].id,
        productId: products[5].id,
        orderItemId: orders[1].items[0].id,
        rating: 4,
        title: 'Good coffee maker',
        comment: 'Makes great coffee every morning. Easy to use and clean.',
        isVerified: true,
        isPublished: true,
      },
    }),
  ])

  console.log('✅ Reviews created')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })