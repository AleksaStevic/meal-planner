/*
  Warnings:

  - You are about to drop the column `name` on the `MacroGoal` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MacroGoal" (
    "id" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_MacroGoal" ("id") SELECT "id" FROM "MacroGoal";
DROP TABLE "MacroGoal";
ALTER TABLE "new_MacroGoal" RENAME TO "MacroGoal";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
