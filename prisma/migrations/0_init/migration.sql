-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "lastActive" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

