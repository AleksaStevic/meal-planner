-- CreateTable
CREATE TABLE "MacroGoal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    CONSTRAINT "MacroGoal_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MealPlan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MacroCondition" (
    "macro" TEXT NOT NULL,
    "min" REAL,
    "max" REAL,
    "goalId" TEXT NOT NULL,

    PRIMARY KEY ("macro", "goalId"),
    CONSTRAINT "MacroCondition_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "MacroGoal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MealDay" (
    "order" INTEGER NOT NULL,
    "planId" TEXT NOT NULL,

    PRIMARY KEY ("order", "planId"),
    CONSTRAINT "MealDay_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MealPlan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MealPlan" (
    "id" TEXT NOT NULL PRIMARY KEY
);
