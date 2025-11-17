-- CreateTable
CREATE TABLE "service_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT,
    "defaultFields" TEXT NOT NULL,
    "fieldSchema" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "service_attributes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "valueType" TEXT NOT NULL DEFAULT 'boolean',
    "options" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "service_attribute_assignments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "service_attribute_assignments_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "service_attribute_assignments_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "service_attributes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pricing_rules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ruleType" TEXT NOT NULL,
    "conditions" TEXT NOT NULL,
    "adjustment" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "validFrom" DATETIME,
    "validUntil" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "pricing_rules_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "price" DECIMAL NOT NULL,
    "promoPrice" DECIMAL,
    "images" TEXT NOT NULL,
    "gender" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "customFields" TEXT,
    "templateId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "services_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "services_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "service_templates" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_services" ("categoryId", "createdAt", "description", "duration", "gender", "id", "images", "isActive", "isPopular", "name", "price", "promoPrice", "updatedAt") SELECT "categoryId", "createdAt", "description", "duration", "gender", "id", "images", "isActive", "isPopular", "name", "price", "promoPrice", "updatedAt" FROM "services";
DROP TABLE "services";
ALTER TABLE "new_services" RENAME TO "services";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "service_templates_name_key" ON "service_templates"("name");

-- CreateIndex
CREATE UNIQUE INDEX "service_attributes_key_key" ON "service_attributes"("key");

-- CreateIndex
CREATE UNIQUE INDEX "service_attribute_assignments_serviceId_attributeId_key" ON "service_attribute_assignments"("serviceId", "attributeId");
