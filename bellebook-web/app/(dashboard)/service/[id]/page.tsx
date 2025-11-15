'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Star,
  Clock,
  ShoppingCart,
  Heart,
  Share2,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import { servicesService, Service } from '@/services/services.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCartStore } from '@/store/cart.store';
import { toast } from 'sonner';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCartStore();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    try {
      setLoading(true);
      const data = await servicesService.getById(id as string);
      setService(data);
    } catch (error) {
      console.error('Error loading service:', error);
      toast.error('Could not load service');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
  };

  const handleAddToCart = () => {
    if (!service) return;

    // Add to cart using store
    addToCart(service, 1, selectedDate?.toISOString().split('T')[0], selectedTime);
    toast.success(`${service.name} was added to your cart`);

    // Redirect to cart
    setTimeout(() => {
      router.push('/cart');
    }, 1500);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(
      isFavorite
        ? 'Service removed from your favorites'
        : 'Service added to your favorites'
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service?.name,
        text: service?.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleBookNow = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please choose a date and time to continue');
      return;
    }

    // TODO: Implement direct booking
    handleAddToCart();
  };

  const nextImage = () => {
    if (service?.images) {
      setCurrentImageIndex((prev) => (prev === service.images.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (service?.images) {
      setCurrentImageIndex((prev) => (prev === 0 ? service.images.length - 1 : prev - 1));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <Card className="text-center p-8">
          <CardContent>
            <p className="text-gray-500 mb-4">Service not found</p>
            <Button onClick={() => router.push('/home')}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const discount = service.promoPrice
    ? Math.round(
        ((Number(service.price) - Number(service.promoPrice)) / Number(service.price)) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-800">Service Details</h1>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavorite}
                className={isFavorite ? 'text-red-500' : ''}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative h-96 bg-gradient-to-br from-pink-100 to-purple-100">
                {service.images && service.images.length > 0 ? (
                  <>
                    <img
                      src={service.images[currentImageIndex]}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                    {service.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                          {service.images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full ${
                                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-8xl opacity-30">💆‍♀️</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Service Information */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{service.name}</CardTitle>
                    <CardDescription className="mt-2">{service.category?.name}</CardDescription>
                  </div>
                  {service.promoPrice && (
                    <Badge className="bg-red-500 text-white">{discount}% OFF</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">{service.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-pink-50 rounded-lg">
                    <Clock className="h-6 w-6 text-pink-600 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold">{service.duration} min</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Star className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="font-semibold">{service.averageRating || 'N/A'}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Bookings</p>
                    <p className="font-semibold">{service.bookingsCount || 0}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <MapPin className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold">Salon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Tabs */}
            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue="reviews">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="policies">Policies</TabsTrigger>
                  </TabsList>

                  <TabsContent value="reviews" className="mt-6">
                    <div className="space-y-4">
                      {service.reviews && service.reviews.length > 0 ? (
                        service.reviews.map((review: any) => (
                          <div key={review.id} className="border-b pb-4 last:border-0">
                            <div className="flex items-start space-x-3">
                              <Avatar>
                                <AvatarImage src={review.user.avatar} />
                                <AvatarFallback>
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-semibold">{review.user.name}</p>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < review.rating
                                            ? 'text-yellow-500 fill-current'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-8">
                          No reviews yet for this service
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="mt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">What's included:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          <li>Initial consultation</li>
                          <li>Procedure application</li>
                          <li>Premium quality products</li>
                          <li>Post-procedure follow-up</li>
                        </ul>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Preparation:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          <li>Arrive 10 minutes before scheduled time</li>
                          <li>Come with clean area</li>
                          <li>Avoid sun 24h before</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="policies" className="mt-6">
                    <div className="space-y-4 text-sm text-gray-600">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Cancellation Policy
                        </h4>
                        <p>
                          Cancellations must be made at least 24 hours in advance.
                          Late cancellations or no-shows may result in a 50% charge
                          of the service value.
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Rescheduling</h4>
                        <p>
                          You can reschedule your appointment free of charge up to 12 hours
                          before the booking.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column - Action Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Book Now</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price */}
                <div>
                  {service.promoPrice ? (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-pink-600">
                          {formatPrice(service.promoPrice)}
                        </span>
                        <span className="text-lg text-gray-400 line-through">
                          {formatPrice(service.price)}
                        </span>
                      </div>
                      <p className="text-sm text-green-600 mt-1">
                        You save{' '}
                        {formatPrice(Number(service.price) - Number(service.promoPrice))}
                      </p>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-gray-800">
                      {formatPrice(service.price)}
                    </span>
                  )}
                  <p className="text-xs text-gray-500 mt-2">or up to 3x interest-free</p>
                </div>

                <Separator />

                {/* Date Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Choose a date:
                  </label>
                  <Input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Choose a time:
                  </label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="11:00">11:00</SelectItem>
                      <SelectItem value="14:00">14:00</SelectItem>
                      <SelectItem value="15:00">15:00</SelectItem>
                      <SelectItem value="16:00">16:00</SelectItem>
                      <SelectItem value="17:00">17:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={handleBookNow}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    size="lg"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Now
                  </Button>
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    className="w-full border-pink-300 text-pink-700 hover:bg-pink-50"
                    size="lg"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>

                {/* Additional info */}
                <div className="text-xs text-gray-500 space-y-1 pt-2">
                  <p>✓ Immediate confirmation</p>
                  <p>✓ Free cancellation up to 24h before</p>
                  <p>✓ Secure payment</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
