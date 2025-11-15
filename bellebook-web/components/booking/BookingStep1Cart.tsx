'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2, Tag, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useBookingStore } from '@/store/booking.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function BookingStep1Cart() {
  const { items, coupon, discount, updateQuantity, removeFromCart, applyCoupon, removeCoupon, getSubtotal, getDiscount, getTotal } = useCartStore();
  const { nextStep, setServices } = useBookingStore();
  
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError('Digite um código promocional');
      return;
    }

    setPromoLoading(true);
    setPromoError('');

    try {
      const isValid = await applyCoupon(promoCode);
      
      if (isValid) {
        setPromoCode('');
        setPromoError('');
      } else {
        setPromoError('Código promocional inválido');
      }
    } catch (error) {
      setPromoError('Erro ao validar código promocional');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromoCode = () => {
    removeCoupon();
    setPromoCode('');
    setPromoError('');
  };

  const handleContinue = () => {
    if (items.length === 0) {
      return;
    }

    const bookingServices = items.map(item => ({
      serviceId: item.service.id,
      serviceName: item.service.name,
      price: Number(item.service.promoPrice || item.service.price),
      duration: item.service.duration || 60, // Default 60 minutes if not specified
      quantity: item.quantity,
    }));

    setServices(bookingServices);
    nextStep();
  };

  const subtotal = getSubtotal();
  const discountAmount = getDiscount();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="py-12">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Tag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Seu carrinho está vazio</h3>
            <p className="text-muted-foreground mb-6">
              Adicione serviços ao carrinho para continuar com o agendamento
            </p>
            <Button asChild>
              <a href="/home">Explorar Serviços</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revise seu Carrinho</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
              {/* Service Image */}
              <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                {item.service.images && item.service.images.length > 0 ? (
                  <Image
                    src={item.service.images[0]}
                    alt={item.service.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Tag className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Service Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-lg mb-1">{item.service.name}</h4>
                {item.service.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {item.service.description}
                  </p>
                )}
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold">
                    R$ {Number(item.service.promoPrice || item.service.price).toFixed(2)}
                  </span>
                  {item.service.promoPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      R$ {Number(item.service.price).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex flex-col items-end gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2 border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm font-semibold">
                  R$ {(Number(item.service.promoPrice || item.service.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Promo Code Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Código Promocional</CardTitle>
        </CardHeader>
        <CardContent>
          {coupon ? (
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="font-medium text-green-700 dark:text-green-300">
                  {coupon} aplicado ({discount}% de desconto)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemovePromoCode}
                className="text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200"
              >
                Remover
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o código promocional"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    setPromoError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleApplyPromoCode();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={handleApplyPromoCode}
                  disabled={promoLoading || !promoCode.trim()}
                >
                  {promoLoading ? 'Validando...' : 'Aplicar'}
                </Button>
              </div>
              {promoError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{promoError}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-base">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-base text-green-600 dark:text-green-400">
              <span>Desconto</span>
              <span className="font-medium">- R$ {discountAmount.toFixed(2)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button variant="outline" asChild className="flex-1">
            <a href="/home">Continuar Comprando</a>
          </Button>
          <Button onClick={handleContinue} className="flex-1">
            Continuar para Agendamento
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
