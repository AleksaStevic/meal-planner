/*
  Warnings:

  - You are about to drop the column `max` on the `MacroCondition` table. All the data in the column will be lost.
  - You are about to drop the column `min` on the `MacroCondition` table. All the data in the column will be lost.
  - Added the required column `type` to the `MacroCondition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `MacroCondition` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MacroCondition" (
    "macro" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "goalId" TEXT NOT NULL,

    PRIMARY KEY ("macro", "goalId"),
    CONSTRAINT "MacroCondition_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "MacroGoal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MacroCondition" ("goalId", "macro") SELECT "goalId", "macro" FROM "MacroCondition";
DROP TABLE "MacroCondition";
ALTER TABLE "new_MacroCondition" RENAME TO "MacroCondition";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
