/*
  Warnings:

  - You are about to alter the column `amount` on the `RecipeIngredient` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RecipeIngredient" (
    "recipeId" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "unitName" TEXT,

    PRIMARY KEY ("recipeId", "foodId"),
    CONSTRAINT "RecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RecipeIngredient_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RecipeIngredient_unitName_foodId_fkey" FOREIGN KEY ("unitName", "foodId") REFERENCES "Unit" ("name", "foodId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RecipeIngredient" ("amount", "foodId", "recipeId", "unitName") SELECT "amount", "foodId", "recipeId", "unitName" FROM "RecipeIngredient";
DROP TABLE "RecipeIngredient";
ALTER TABLE "new_RecipeIngredient" RENAME TO "RecipeIngredient";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
