/*
  Warnings:

  - Added the required column `name` to the `MacroGoal` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MacroGoal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_MacroGoal" ("id") SELECT "id" FROM "MacroGoal";
DROP TABLE "MacroGoal";
ALTER TABLE "new_MacroGoal" RENAME TO "MacroGoal";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
