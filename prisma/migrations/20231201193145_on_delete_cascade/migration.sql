-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RecipeMealDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipeId" TEXT NOT NULL,
    "dayOrder" INTEGER NOT NULL,
    "planId" TEXT NOT NULL,
    CONSTRAINT "RecipeMealDay_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RecipeMealDay_dayOrder_planId_fkey" FOREIGN KEY ("dayOrder", "planId") REFERENCES "MealDay" ("order", "planId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RecipeMealDay" ("dayOrder", "id", "planId", "recipeId") SELECT "dayOrder", "id", "planId", "recipeId" FROM "RecipeMealDay";
DROP TABLE "RecipeMealDay";
ALTER TABLE "new_RecipeMealDay" RENAME TO "RecipeMealDay";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
