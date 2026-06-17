-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "squadId" INTEGER;

-- CreateIndex
CREATE INDEX "Team_squadId_idx" ON "Team"("squadId");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_squadId_fkey" FOREIGN KEY ("squadId") REFERENCES "Squad"("id") ON DELETE SET NULL ON UPDATE CASCADE;
