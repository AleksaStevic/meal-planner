-- CreateTable
CREATE TABLE "RecipeMealDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipeId" TEXT NOT NULL,
    "dayOrder" INTEGER NOT NULL,
    "planId" TEXT NOT NULL,
    CONSTRAINT "RecipeMealDay_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RecipeMealDay_dayOrder_planId_fkey" FOREIGN KEY ("dayOrder", "planId") REFERENCES "MealDay" ("order", "planId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MealDay" (
    "order" INTEGER NOT NULL,
    "planId" TEXT NOT NULL,

    PRIMARY KEY ("order", "planId"),
    CONSTRAINT "MealDay_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MealPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MealDay" ("order", "planId") SELECT "order", "planId" FROM "MealDay";
DROP TABLE "MealDay";
ALTER TABLE "new_MealDay" RENAME TO "MealDay";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
