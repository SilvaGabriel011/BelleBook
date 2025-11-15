import CustomerLayout from '@/components/customer/layout/CustomerLayout';
import HeroSection from '@/components/customer/home/HeroSection';
import NextAppointment from '@/components/customer/home/NextAppointment';
import LoyaltyCard from '@/components/customer/home/LoyaltyCard';
import PromoBanner from '@/components/customer/home/PromoBanner';
import CategoryGrid from '@/components/customer/home/CategoryGrid';
import PopularServices from '@/components/customer/home/PopularServices';
import Testimonials from '@/components/customer/home/Testimonials';

export default function CustomerHomePage() {
  // TODO: Fetch data from API
  // const nextBooking = await getNextBooking();
  // const loyaltyPoints = await getLoyaltyPoints();
  // const banners = await getActiveBanners();
  // const popularServices = await getPopularServices();
  // const testimonials = await getFeaturedReviews();

  const mockNextBooking = {
    id: '1',
    date: '2024-11-20',
    time: '14:00',
    service: 'Design de Sobrancelhas',
    location: 'Salão Belle - Centro',
    status: 'CONFIRMED',
  };

  return (
    <CustomerLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Next Appointment Card */}
        <NextAppointment booking={mockNextBooking} />

        {/* Loyalty Points Widget */}
        <LoyaltyCard points={250} nextRewardPoints={500} />

        {/* Promotional Carousel */}
        <PromoBanner />

        {/* Category Grid */}
        <CategoryGrid />

        {/* Popular Services */}
        <PopularServices />

        {/* Testimonials */}
        <Testimonials />
      </div>
    </CustomerLayout>
  );
}
