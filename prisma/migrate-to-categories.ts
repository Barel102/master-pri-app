/**
 * One-time migration: Product.category (string) -> Category model + categoryId
 * Run: npx tsx prisma/migrate-to-categories.ts
 */
import "dotenv/config";
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL ?? "file:./dev.db";

const client = createClient({ url });

const CATEGORY_MAP: Record<string, string> = {
  Fruits: "פירות",
  Vegetables: "ירקות",
  פירות: "פירות",
  ירקות: "ירקות",
};

async function tableExists(name: string): Promise<boolean> {
  const result = await client.execute({
    sql: `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
    args: [name],
  });
  return result.rows.length > 0;
}

async function columnExists(table: string, column: string): Promise<boolean> {
  const result = await client.execute(`PRAGMA table_info(${table})`);
  return result.rows.some((row) => row.name === column);
}

async function main() {
  const hasCategoryTable = await tableExists("Category");
  const hasCategoryId = await columnExists("Product", "categoryId");
  const hasOldCategory = await columnExists("Product", "category");

  if (hasCategoryTable && hasCategoryId && !hasOldCategory) {
    console.log("Database already migrated.");
    return;
  }

  if (!hasCategoryTable) {
    await client.execute(`
      CREATE TABLE "Category" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "name" TEXT NOT NULL
      )
    `);
    await client.execute(`
      CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name")
    `);
    console.log("Created Category table.");
  }

  for (const name of ["פירות", "ירקות"]) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO "Category" ("name") VALUES (?)`,
      args: [name],
    });
  }

  if (!hasCategoryId) {
    await client.execute(`ALTER TABLE "Product" ADD COLUMN "categoryId" INTEGER`);
    console.log("Added categoryId column.");
  }

  if (hasOldCategory) {
    const products = await client.execute(`SELECT id, category FROM "Product"`);
    for (const row of products.rows) {
      const id = Number(row.id);
      const rawCategory = String(row.category ?? "");
      const categoryName = CATEGORY_MAP[rawCategory] ?? rawCategory;

      const cat = await client.execute({
        sql: `SELECT id FROM "Category" WHERE name = ?`,
        args: [categoryName],
      });

      let categoryId = cat.rows[0]?.id as number | undefined;

      if (!categoryId && categoryName) {
        const inserted = await client.execute({
          sql: `INSERT INTO "Category" ("name") VALUES (?)`,
          args: [categoryName],
        });
        categoryId = Number(inserted.lastInsertRowid);
      }

      if (!categoryId) {
        throw new Error(`Could not resolve category for product ${id}: ${rawCategory}`);
      }

      await client.execute({
        sql: `UPDATE "Product" SET "categoryId" = ? WHERE id = ?`,
        args: [categoryId, id],
      });
    }

    await client.execute(`ALTER TABLE "Product" DROP COLUMN "category"`);
    console.log("Migrated product categories and dropped old column.");
  }

  console.log("Migration complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    client.close();
  });
