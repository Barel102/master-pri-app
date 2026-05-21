import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const categoryNames = ["פירות", "ירקות"] as const;

const sampleProducts = [
  {
    name: "תפוחים",
    price: 12.9,
    imageUrl:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop",
    categoryName: "פירות",
  },
  {
    name: "בננות",
    price: 8.5,
    imageUrl:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
    categoryName: "פירות",
  },
  {
    name: "תפוזים",
    price: 9.9,
    imageUrl:
      "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop",
    categoryName: "פירות",
  },
  {
    name: "עגבניות",
    price: 7.5,
    imageUrl:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=400&fit=crop",
    categoryName: "ירקות",
  },
  {
    name: "מלפפונים",
    price: 6.9,
    imageUrl:
      "https://images.unsplash.com/photo-1604977042943-807fc7e4ed9c?w=400&h=400&fit=crop",
    categoryName: "ירקות",
  },
  {
    name: "חסה",
    price: 5.5,
    imageUrl:
      "https://images.unsplash.com/photo-1622206151226-18ca68c9a9f1?w=400&h=400&fit=crop",
    categoryName: "ירקות",
  },
];

async function main() {
  const categoryMap = new Map<string, number>();

  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categoryMap.set(name, category.id);
  }

  for (const product of sampleProducts) {
    const categoryId = categoryMap.get(product.categoryName);
    if (!categoryId) {
      throw new Error(`Missing category: ${product.categoryName}`);
    }

    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    });

    const data = {
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      categoryId,
      isAvailable: true,
    };

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.product.create({ data });
    }
  }

  console.log(
    `Seeded ${categoryNames.length} categories and ${sampleProducts.length} products`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
