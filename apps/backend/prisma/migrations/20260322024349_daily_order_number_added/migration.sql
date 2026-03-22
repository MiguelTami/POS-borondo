/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "isActive" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Ingredient" ALTER COLUMN "stock" SET DEFAULT 0,
ALTER COLUMN "isActive" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "isActive" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Table" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';

-- CreateTable
CREATE TABLE "DailyOrderCounter" (
    "businessDate" TIMESTAMP(3) NOT NULL,
    "lastOrderNumber" INTEGER NOT NULL,

    CONSTRAINT "DailyOrderCounter_pkey" PRIMARY KEY ("businessDate")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_name_key" ON "Ingredient"("name");
