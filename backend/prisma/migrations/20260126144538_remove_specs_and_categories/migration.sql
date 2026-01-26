/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `specifications` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Equipment" DROP CONSTRAINT "Equipment_categoryId_fkey";

-- AlterTable
ALTER TABLE "Equipment" DROP COLUMN "categoryId",
DROP COLUMN "specifications";

-- DropTable
DROP TABLE "Category";
