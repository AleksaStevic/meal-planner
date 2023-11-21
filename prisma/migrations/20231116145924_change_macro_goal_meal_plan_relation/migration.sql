/*
  Warnings:

  - You are about to drop the column `planId` on the `MacroGoal` table. All the data in the column will be lost.
  - Added the required column `goalId` to the `MealPlan` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MealPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goalId" TEXT NOT NULL,
    CONSTRAINT "MealPlan_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "MacroGoal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MealPlan" ("id") SELECT "id" FROM "MealPlan";
DROP TABLE "MealPlan";
ALTER TABLE "new_MealPlan" RENAME TO "MealPlan";
CREATE UNIQUE INDEX "MealPlan_goalId_key" ON "MealPlan"("goalId");
CREATE TABLE "new_MacroGoal" (
    "id" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_MacroGoal" ("id") SELECT "id" FROM "MacroGoal";
DROP TABLE "MacroGoal";
ALTER TABLE "new_MacroGoal" RENAME TO "MacroGoal";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
