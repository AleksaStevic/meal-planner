/*
  Warnings:

  - Added the required column `unitName` to the `RecipeIngredient` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Unit" (
    "name" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    "amount" REAL NOT NULL,

    PRIMARY KEY ("name", "foodId"),
    CONSTRAINT "Unit_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RecipeIngredient" (
    "recipeId" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "unitName" TEXT NOT NULL,

    PRIMARY KEY ("recipeId", "foodId"),
    CONSTRAINT "RecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RecipeIngredient_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RecipeIngredient_unitName_foodId_fkey" FOREIGN KEY ("unitName", "foodId") REFERENCES "Unit" ("name", "foodId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RecipeIngredient" ("amount", "foodId", "recipeId") SELECT "amount", "foodId", "recipeId" FROM "RecipeIngredient";
DROP TABLE "RecipeIngredient";
ALTER TABLE "new_RecipeIngredient" RENAME TO "RecipeIngredient";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
