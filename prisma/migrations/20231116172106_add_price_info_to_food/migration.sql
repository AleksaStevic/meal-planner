-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Food" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "calories" REAL NOT NULL,
    "carbs" REAL NOT NULL,
    "fat" REAL NOT NULL,
    "protein" REAL NOT NULL,
    "packageAmount" REAL NOT NULL DEFAULT 1,
    "price" REAL NOT NULL DEFAULT 0
);
INSERT INTO "new_Food" ("calories", "carbs", "fat", "id", "name", "protein") SELECT "calories", "carbs", "fat", "id", "name", "protein" FROM "Food";
DROP TABLE "Food";
ALTER TABLE "new_Food" RENAME TO "Food";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
