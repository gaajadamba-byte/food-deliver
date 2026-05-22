/*
  Warnings:

  - You are about to drop the column `resetPasswordToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "resetPasswordToken";

-- CreateTable
CREATE TABLE "_UserOrderedFoods" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserOrderedFoods_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserOrderedFoods_B_index" ON "_UserOrderedFoods"("B");

-- AddForeignKey
ALTER TABLE "_UserOrderedFoods" ADD CONSTRAINT "_UserOrderedFoods_A_fkey" FOREIGN KEY ("A") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserOrderedFoods" ADD CONSTRAINT "_UserOrderedFoods_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
