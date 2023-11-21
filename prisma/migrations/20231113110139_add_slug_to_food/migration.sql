/*
  Warnings:

  - Added the required column `slug` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Food" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "calories" REAL NOT NULL,
    "carbs" REAL NOT NULL,
    "fat" REAL NOT NULL,
    "protein" REAL NOT NULL
);
INSERT INTO "new_Food" ("calories", "carbs", "fat", "id", "name", "protein") SELECT "calories", "carbs", "fat", "id", "name", "protein" FROM "Food";
DROP TABLE "Food";
ALTER TABLE "new_Food" RENAME TO "Food";
CREATE UNIQUE INDEX "Food_slug_key" ON "Food"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
