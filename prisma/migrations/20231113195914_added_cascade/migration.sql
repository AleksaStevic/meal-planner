-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RecipeIngredient" (
    "recipeId" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "unitName" TEXT,

    PRIMARY KEY ("recipeId", "foodId"),
    CONSTRAINT "RecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RecipeIngredient_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RecipeIngredient_unitName_foodId_fkey" FOREIGN KEY ("unitName", "foodId") REFERENCES "Unit" ("name", "foodId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RecipeIngredient" ("amount", "foodId", "recipeId", "unitName") SELECT "amount", "foodId", "recipeId", "unitName" FROM "RecipeIngredient";
DROP TABLE "RecipeIngredient";
ALTER TABLE "new_RecipeIngredient" RENAME TO "RecipeIngredient";
CREATE TABLE "new_Unit" (
    "name" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    "amount" REAL NOT NULL,

    PRIMARY KEY ("name", "foodId"),
    CONSTRAINT "Unit_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Unit" ("amount", "foodId", "name") SELECT "amount", "foodId", "name" FROM "Unit";
DROP TABLE "Unit";
ALTER TABLE "new_Unit" RENAME TO "Unit";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
