-- AlterTable
ALTER TABLE "Squad" ADD COLUMN     "managerName" TEXT,
ADD COLUMN     "leadName" TEXT;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "managerName" TEXT,
ADD COLUMN     "leadName" TEXT;

-- AlterTable
ALTER TABLE "IssueType" ADD COLUMN     "managerName" TEXT,
ADD COLUMN     "leadName" TEXT;

-- AlterTable
ALTER TABLE "Status" ADD COLUMN     "managerName" TEXT,
ADD COLUMN     "leadName" TEXT;

-- AlterTable
ALTER TABLE "FixVersion" ADD COLUMN     "managerName" TEXT,
ADD COLUMN     "leadName" TEXT;

-- AlterTable
ALTER TABLE "SprintNumber" ADD COLUMN     "managerName" TEXT,
ADD COLUMN     "leadName" TEXT;

-- AlterTable
ALTER TABLE "Priority" ADD COLUMN     "managerName" TEXT,
ADD COLUMN     "leadName" TEXT;
