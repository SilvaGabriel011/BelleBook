# Service Extensibility Features

This document describes the extensibility features added to the BelleBook service management system, allowing administrators to easily customize and extend service offerings without code changes.

## Overview

The service management system now includes four powerful extensibility features:

1. **Custom Fields** - Store arbitrary metadata per service
2. **Service Templates** - Predefined templates for common service types
3. **Service Attributes** - Flexible tagging and categorization system
4. **Dynamic Pricing Rules** - Conditional pricing based on time, day, season, or demand

## 1. Custom Fields

Custom fields allow you to store any additional data on a service without modifying the database schema.

### Backend API

**Add custom fields when creating/updating a service:**

```typescript
POST /services
{
  "name": "Manicure Premium",
  "description": "Manicure with gel polish",
  "categoryId": "cat_123",
  "price": 80.00,
  "duration": 60,
  "images": ["https://..."],
  "customFields": {
    "location": "in-salon",
    "skill_level": "advanced",
    "requires_consultation": "false",
    "materials_included": "gel polish, nail art"
  }
}
```

### Frontend Usage

The Service Form Dialog now includes a "Custom Fields" section where admins can add key-value pairs dynamically:

1. Enter field name (e.g., "location", "skill_level")
2. Enter field value
3. Click "Adicionar" to add the field
4. Fields are displayed below and can be removed individually

### Use Cases

- **Location type**: "in-salon", "at-home", "both"
- **Skill level**: "beginner", "intermediate", "advanced"
- **Special requirements**: consultation needed, materials included, etc.
- **Seasonal availability**: summer only, winter special, etc.
- **Target audience**: age group, gender preference, etc.

## 2. Service Templates

Templates provide predefined configurations for common service types, making it faster to create new services with consistent settings.

### Backend API

**Endpoints:**
- `GET /service-templates` - List all templates (Admin only)
- `GET /service-templates/:id` - Get template details (Admin only)
- `POST /service-templates` - Create template (Admin only)
- `PUT /service-templates/:id` - Update template (Admin only)
- `DELETE /service-templates/:id` - Delete/deactivate template (Admin only)

**Create a template:**

```typescript
POST /service-templates
{
  "name": "Basic Manicure Template",
  "description": "Standard manicure service template",
  "categoryId": "cat_nails",
  "defaultFields": {
    "duration": 45,
    "price": 50.00,
    "customFields": {
      "location": "in-salon",
      "materials_included": "basic polish"
    }
  },
  "fieldSchema": {
    "type": "object",
    "properties": {
      "location": { "type": "string", "enum": ["in-salon", "at-home"] },
      "materials_included": { "type": "string" }
    }
  }
}
```

**Use a template when creating a service:**

```typescript
POST /services
{
  "name": "Classic Manicure",
  "description": "Traditional manicure service",
  "templateId": "tpl_123",
  "categoryId": "cat_nails",
  "price": 50.00,
  "duration": 45,
  "images": ["https://..."]
}
```

### Benefits

- **Consistency**: Ensure all services of the same type have similar configurations
- **Speed**: Quickly create new services with pre-filled defaults
- **Validation**: Optional JSON schema validation for custom fields
- **Maintenance**: Update template to affect all services using it

## 3. Service Attributes

Attributes provide a flexible tagging system for services, allowing for advanced filtering and categorization.

### Backend API

**Attribute Management:**
- `GET /service-attributes` - List all attributes (Admin only)
- `GET /service-attributes/:id` - Get attribute details (Admin only)
- `GET /service-attributes/service/:serviceId` - Get attributes for a service (Public)
- `POST /service-attributes` - Create attribute (Admin only)
- `PUT /service-attributes/:id` - Update attribute (Admin only)
- `DELETE /service-attributes/:id` - Delete/deactivate attribute (Admin only)

**Create an attribute:**

```typescript
POST /service-attributes
{
  "key": "location-type",
  "name": "Tipo de Localização",
  "description": "Onde o serviço pode ser realizado",
  "valueType": "select",
  "options": ["in-salon", "at-home", "both"]
}
```

**Assign attributes to a service:**

```typescript
POST /services
{
  "name": "Mobile Manicure",
  "description": "Manicure at your location",
  "categoryId": "cat_nails",
  "price": 100.00,
  "duration": 60,
  "images": ["https://..."],
  "attributes": [
    { "attributeId": "attr_location", "value": "at-home" },
    { "attributeId": "attr_skill", "value": "advanced" }
  ]
}
```

### Attribute Value Types

- **boolean**: true/false values
- **string**: Free text
- **number**: Numeric values
- **select**: Predefined options (dropdown)

### Use Cases

- **Location filtering**: Filter services by where they're performed
- **Skill level**: Match services to customer experience level
- **Special features**: Eco-friendly, vegan products, hypoallergenic, etc.
- **Time requirements**: Quick service, extended service, multi-session
- **Equipment needs**: Requires special equipment, portable, etc.

## 4. Dynamic Pricing Rules

Pricing rules allow automatic price adjustments based on conditions like time of day, day of week, season, or demand.

### Backend API

**Pricing Rule Management:**
- `GET /pricing-rules` - List all rules (Admin only)
- `GET /pricing-rules/:id` - Get rule details (Admin only)
- `GET /pricing-rules/service/:serviceId` - Get rules for a service (Public)
- `POST /pricing-rules/calculate-price/:serviceId` - Calculate price with context (Public)
- `POST /pricing-rules` - Create rule (Admin only)
- `PUT /pricing-rules/:id` - Update rule (Admin only)
- `DELETE /pricing-rules/:id` - Delete rule (Admin only)

**Create a pricing rule:**

```typescript
POST /pricing-rules
{
  "serviceId": "svc_123",
  "name": "Evening Premium",
  "description": "20% increase for evening appointments",
  "ruleType": "TIME_BASED",
  "conditions": {
    "timeRange": "18:00-22:00"
  },
  "adjustment": {
    "type": "percentage",
    "value": 20,
    "operation": "increase"
  },
  "priority": 10,
  "isActive": true
}
```

**Calculate dynamic price:**

```typescript
POST /pricing-rules/calculate-price/svc_123
{
  "dayOfWeek": 6,  // Saturday
  "time": "19:00",
  "season": "summer"
}

Response:
{
  "price": 96.00  // Base price 80 + 20% evening premium
}
```

### Rule Types

- **TIME_BASED**: Based on time of day (e.g., evening premium)
- **DAY_BASED**: Based on day of week (e.g., weekend surcharge)
- **SEASON_BASED**: Based on season (e.g., summer discount)
- **DEMAND_BASED**: Based on demand/availability (future enhancement)

### Adjustment Types

- **percentage**: Increase/decrease by percentage
- **fixed**: Increase/decrease by fixed amount

### Priority System

Rules are applied in order of priority (highest first). If multiple rules match, they're applied sequentially.

### Use Cases

- **Peak hour pricing**: Higher prices during busy times
- **Off-peak discounts**: Lower prices to fill slow periods
- **Weekend premiums**: Higher prices on weekends
- **Seasonal promotions**: Summer discounts, holiday specials
- **Early bird specials**: Discounts for morning appointments
- **Last-minute pricing**: Dynamic pricing for same-day bookings

## Database Schema

### Service Model Extensions

```prisma
model Service {
  // ... existing fields ...
  customFields  String?   // JSON: {key: value}
  templateId    String?
  
  template      ServiceTemplate?
  attributes    ServiceAttributeAssignment[]
  pricingRules  PricingRule[]
}
```

### New Models

```prisma
model ServiceTemplate {
  id            String
  name          String   @unique
  description   String?
  categoryId    String?
  defaultFields String   // JSON
  fieldSchema   String?  // JSON Schema
  isActive      Boolean
  services      Service[]
}

model ServiceAttribute {
  id          String
  key         String   @unique
  name        String
  description String?
  valueType   String   // boolean, string, number, select
  options     String?  // JSON array
  isActive    Boolean
  assignments ServiceAttributeAssignment[]
}

model ServiceAttributeAssignment {
  id          String
  serviceId   String
  attributeId String
  value       String
  service     Service
  attribute   ServiceAttribute
}

model PricingRule {
  id          String
  serviceId   String
  name        String
  description String?
  ruleType    String   // TIME_BASED, DAY_BASED, SEASON_BASED, DEMAND_BASED
  conditions  String   // JSON
  adjustment  String   // JSON
  priority    Int
  isActive    Boolean
  validFrom   DateTime?
  validUntil  DateTime?
  service     Service
}
```

## Security

All admin endpoints require:
- Valid JWT authentication
- ADMIN role

Public endpoints (read-only):
- Service attributes for a specific service
- Pricing rules for a specific service
- Price calculation

## Migration

The database migration `20251117023055_add_service_extensibility_features` adds all necessary tables and columns.

Run migration:
```bash
cd bellebook-backend
npx prisma migrate deploy
```

## Future Enhancements

1. **Template Inheritance**: Templates that extend other templates
2. **Attribute Groups**: Organize attributes into logical groups
3. **Advanced Pricing**: Machine learning-based demand pricing
4. **Validation Rules**: Custom validation for custom fields
5. **Bulk Operations**: Apply templates/attributes to multiple services
6. **Attribute Filtering**: Frontend filtering by attributes
7. **Price History**: Track price changes over time
8. **A/B Testing**: Test different pricing strategies

## Examples

### Example 1: Spa Package with Custom Fields

```typescript
{
  "name": "Relaxation Spa Package",
  "description": "Full body massage + facial + manicure",
  "categoryId": "cat_spa",
  "price": 250.00,
  "duration": 180,
  "customFields": {
    "package_type": "premium",
    "includes": "massage,facial,manicure",
    "aromatherapy": "included",
    "music_therapy": "included",
    "refreshments": "tea and snacks"
  }
}
```

### Example 2: Seasonal Service with Pricing Rules

```typescript
// Create service
POST /services
{
  "name": "Summer Pedicure Special",
  "categoryId": "cat_nails",
  "price": 60.00,
  "duration": 45
}

// Add summer discount rule
POST /pricing-rules
{
  "serviceId": "svc_summer_pedi",
  "name": "Summer Discount",
  "ruleType": "SEASON_BASED",
  "conditions": { "season": "summer" },
  "adjustment": {
    "type": "percentage",
    "value": 15,
    "operation": "decrease"
  },
  "priority": 5,
  "validFrom": "2025-06-01",
  "validUntil": "2025-08-31"
}
```

### Example 3: Mobile Service with Attributes

```typescript
{
  "name": "At-Home Hair Styling",
  "categoryId": "cat_hair",
  "price": 120.00,
  "duration": 90,
  "attributes": [
    { "attributeId": "attr_location", "value": "at-home" },
    { "attributeId": "attr_equipment", "value": "portable" },
    { "attributeId": "attr_travel", "value": "within-10km" }
  ],
  "customFields": {
    "travel_fee": "included",
    "equipment_provided": "all styling tools",
    "parking_required": "yes"
  }
}
```

## Support

For questions or issues with extensibility features, please refer to:
- API documentation: `/docs/API.md`
- Service admin guide: `/docs/SERVICES_ADMIN_GUIDE.md`
- GitHub issues: https://github.com/SilvaGabriel011/BelleBook/issues
