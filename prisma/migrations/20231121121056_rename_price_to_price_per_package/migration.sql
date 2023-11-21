/*
  Warnings:

  - You are about to drop the column `price` on the `Food` table. All the data in the column will be lost.
  - Added the required column `packagePrice` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Food" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "calories" REAL NOT NULL,
    "carbs" REAL NOT NULL,
    "fat" REAL NOT NULL,
    "protein" REAL NOT NULL,
    "packageAmount" REAL NOT NULL,
    "packagePrice" REAL NOT NULL,
    "divisible" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Food" ("calories", "carbs", "divisible", "fat", "id", "name", "packageAmount", "packagePrice", "protein") SELECT "calories", "carbs", "divisible", "fat", "id", "name", "packageAmount", "price", "protein" FROM "Food";
DROP TABLE "Food";
ALTER TABLE "new_Food" RENAME TO "Food";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
