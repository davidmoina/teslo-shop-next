-- DropIndex
DROP INDEX "Country_id_key";

-- AlterTable
ALTER TABLE "Country" ADD CONSTRAINT "Country_pkey" PRIMARY KEY ("id");
