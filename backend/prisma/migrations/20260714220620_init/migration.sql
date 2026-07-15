-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "dateOfBirth" DATETIME,
    "phoneNumber" TEXT,
    "whatsappNumber" TEXT,
    "email" TEXT,
    "homeAddress" TEXT,
    "occupation" TEXT,
    "maritalStatus" TEXT,
    "dateJoined" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "baptized" BOOLEAN NOT NULL DEFAULT false,
    "isWorker" BOOLEAN NOT NULL DEFAULT false,
    "position" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "profilePicture" TEXT,
    "parentId" TEXT,
    "referredById" TEXT,
    "familyId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Member_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Member" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Member_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "Member" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Member_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "markedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Attendance_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attendance_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tithe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" TEXT NOT NULL,
    "reference" TEXT,
    "remarks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Tithe_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TransferLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "transferredFromId" TEXT,
    "transferredToId" TEXT,
    "reason" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminId" TEXT,
    CONSTRAINT "TransferLog_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TransferLog_transferredFromId_fkey" FOREIGN KEY ("transferredFromId") REFERENCES "Member" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransferLog_transferredToId_fkey" FOREIGN KEY ("transferredToId") REFERENCES "Member" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Family" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_memberId_serviceId_key" ON "Attendance"("memberId", "serviceId");
