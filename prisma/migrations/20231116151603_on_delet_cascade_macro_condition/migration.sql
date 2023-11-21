-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MacroCondition" (
    "macro" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "goalId" TEXT NOT NULL,

    PRIMARY KEY ("macro", "goalId"),
    CONSTRAINT "MacroCondition_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "MacroGoal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MacroCondition" ("goalId", "macro", "type", "value") SELECT "goalId", "macro", "type", "value" FROM "MacroCondition";
DROP TABLE "MacroCondition";
ALTER TABLE "new_MacroCondition" RENAME TO "MacroCondition";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
