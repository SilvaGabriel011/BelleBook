# Phase 2: Main Customer App

**Duration**: 2 weeks | **Priority**: HIGH

## Customer Home Page Components

### Files to Create

1. `bellebook-web/app/(customer)/page.tsx` - Home page
2. `bellebook-web/components/customer/home/HeroSection.tsx` - Welcome banner
3. `bellebook-web/components/customer/home/NextAppointment.tsx` - Upcoming booking card
4. `bellebook-web/components/customer/home/LoyaltyCard.tsx` - Points widget
5. `bellebook-web/components/customer/home/PromoBanner.tsx` - Carousel banners
6. `bellebook-web/components/customer/home/CategoryGrid.tsx` - Service categories
7. `bellebook-web/components/customer/home/PopularServices.tsx` - Top services
8. `bellebook-web/components/customer/home/Testimonials.tsx` - Customer reviews
9. `bellebook-web/components/customer/layout/CustomerLayout.tsx` - Main layout
10. `bellebook-web/components/customer/layout/BottomNav.tsx` - Mobile navigation

## Home Page Sections

### 1. Hero Section
- Welcome message
- Search bar
- Primary CTA: "Agendar Agora"
- Background image/gradient

### 2. Next Appointment Card (if user has booking)
- Date and time
- Service name
- Location
- Status badge
- Quick actions: View details, Reschedule, Cancel

### 3. Loyalty Points Widget
- Points balance with circular progress
- "Você tem X pontos"
- Progress to next reward
- Link to rewards page
- Referral CTA

### 4. Promotional Carousel
- Swipeable banners (use `embla-carousel-react`)
- Auto-play with pause on hover
- Dot indicators
- Admin-manageable content
- Click to navigate

### 5. Category Grid
- Gender toggle: Feminino / Masculino
- 4 main categories: Unha, Sobrancelha, Cabelo, Depilação
- Service count badge
- Category images
- Hover effects

### 6. Popular Services
- Top 6-8 services by bookings
- Service cards (reuse from Phase 1)
- "Ver todos" link

### 7. Testimonials
- Customer reviews with 5-star ratings
- Customer name and service
- Carousel or grid layout
- Photos (optional)

## Navigation Layout

### Desktop Header
- Logo (left)
- Search icon
- Notifications icon (with badge)
- Cart icon (with count)
- User avatar dropdown

### Mobile Bottom Navigation
- Home
- Services
- Appointments
- Profile
- Cart (with badge)

## Loyalty System

Add to `prisma/schema.prisma`:

```prisma
model User {
  // ... existing fields
  points          Int      @default(0)
  pointsHistory   Json?    // [{action, points, date, description}]
}

model LoyaltyReward {
  id          String   @id @default(uuid())
  name        String
  points      Int
  type        String   // "DISCOUNT", "FREE_SERVICE", "UPGRADE"
  value       Float
  isActive    Boolean  @default(true)
}
```

### Points Rules
- +10 points per R$1 spent
- +50 points for first booking
- +100 points per referral
- +25 points for review with photo

## Implementation Steps

1. Create customer layout with navigation
2. Build home page skeleton
3. Implement hero section
4. Add next appointment widget (fetch from API)
5. Create loyalty points display
6. Build promotional carousel
7. Implement category grid with gender toggle
8. Add popular services section
9. Create testimonials carousel
10. Add mobile bottom navigation
11. Implement search functionality
12. Add notification system
13. Test all components

## API Endpoints Needed

```typescript
GET /bookings/next          // Next appointment
GET /services/popular       // Popular services  
GET /promotions/active      // Active banners
GET /reviews/featured       // Testimonials
GET /users/me/points        // Loyalty points
GET /loyalty/rewards        // Available rewards
```

## Testing Checklist

- [ ] Home page loads quickly (< 2s)
- [ ] Next appointment displays correctly
- [ ] Loyalty points accurate
- [ ] Carousel auto-plays
- [ ] Category grid responsive
- [ ] Gender toggle works
- [ ] Navigation works on mobile
- [ ] Search redirects correctly
- [ ] Notifications display
- [ ] Cart badge updates

**Next**: [Phase 3: Booking Flow](./PHASE_3_BOOKING_FLOW.md)
