-- DropForeignKey
ALTER TABLE "EquipmentImage" DROP CONSTRAINT "EquipmentImage_equipmentId_fkey";

-- AddForeignKey
ALTER TABLE "EquipmentImage" ADD CONSTRAINT "EquipmentImage_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
