# Phase 1: Service Catalog

**Duration**: 1.5 weeks | **Priority**: HIGH

## Database Updates

Add to `bellebook-backend/prisma/schema.prisma`:

```prisma
model ServiceVariant {
  id          String   @id @default(uuid())
  serviceId   String
  name        String
  price       Float
  duration    Int
  isActive    Boolean  @default(true)
  service     Service  @relation(fields: [serviceId], references: [id])
  @@map("service_variants")
}

model ServicePackage {
  id            String   @id @default(uuid())
  name          String
  services      Json     // [{serviceId, variantId, quantity}]
  packagePrice  Float
  sessionsCount Int
  isActive      Boolean  @default(true)
  @@map("service_packages")
}
```

Run: `npx prisma migrate dev --name add_service_variants`

## Backend API Endpoints

Add to `bellebook-backend/src/services/services.controller.ts`:

```typescript
GET /services?category=&gender=&minPrice=&maxPrice=&sort=&search=&page=&limit=
GET /services/:id/details
GET /services/popular?limit=10
GET /services/packages
GET /services/:id/variants
```

## Frontend Files to Create

1. `bellebook-web/stores/service.store.ts` - Service state management
2. `bellebook-web/services/service.api.ts` - API client
3. `bellebook-web/app/(customer)/services/page.tsx` - Catalog page
4. `bellebook-web/app/(customer)/services/[id]/page.tsx` - Detail page
5. `bellebook-web/components/customer/ServiceCard.tsx` - Card component
6. `bellebook-web/components/customer/ServiceFilters.tsx` - Filter sidebar
7. `bellebook-web/components/customer/CategoryTabs.tsx` - Category nav

## Key Features

- Grid/List view toggle
- Filters: Price range, rating, category, gender
- Sort: Price, popularity, newest, rating
- Search with debounce (300ms)
- Infinite scroll or load more button
- Skeleton loading states
- Empty states with "Clear filters" button

## Implementation Steps

1. Run database migration
2. Update backend services with filter logic
3. Add new controller endpoints
4. Create Zustand store for services
5. Build service API client
6. Create service catalog page
7. Build service card component
8. Add filter sidebar
9. Create service detail page
10. Add tests

## Testing Checklist

- [ ] Services load on page load
- [ ] Category filter works
- [ ] Price filter works
- [ ] Search returns results
- [ ] Pagination/infinite scroll works
- [ ] Service detail page shows all data
- [ ] Variants display correctly
- [ ] Mobile responsive
- [ ] Loading states shown
- [ ] Error states handled gracefully

**Next**: [Phase 2: Customer App](./PHASE_2_CUSTOMER_APP.md)
