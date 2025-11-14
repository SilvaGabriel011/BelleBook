'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Clock,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    coupon,
    discount,
    removeFromCart,
    updateQuantity,
    updateSchedule,
    clearCart,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getTotal,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      toast.error('Digite um código de cupom');
      return;
    }

    setIsApplyingCoupon(true);
    const success = await applyCoupon(couponInput.trim());

    if (success) {
      toast.success('Cupom aplicado com sucesso!');
      setCouponInput('');
    } else {
      toast.error('Cupom inválido ou expirado');
    }

    setIsApplyingCoupon(false);
  };

  const handleCheckout = () => {
    // Redirecionar para a página de agendamento
    router.push('/booking');
  };

  const handleContinueShopping = () => {
    router.push('/home');
  };

  const subtotal = getSubtotal();
  const discountValue = getDiscount();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <header className="bg-white shadow-sm border-b border-pink-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">Carrinho</h1>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Seu carrinho está vazio</h2>
              <p className="text-gray-500 mb-6">Adicione serviços ao carrinho para continuar</p>
              <Button onClick={handleContinueShopping}>Explorar Serviços</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">
                Carrinho ({items.length} {items.length === 1 ? 'item' : 'itens'})
              </h1>
            </div>

            <Button
              variant="ghost"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Limpar Carrinho
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Itens */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Imagem */}
                    <div className="w-full md:w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-4xl">💆‍♀️</span>
                    </div>

                    {/* Detalhes */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{item.service.name}</h3>
                        <p className="text-sm text-gray-600">{item.service.category?.name}</p>
                      </div>

                      {/* Duração e Preço */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {item.service.duration} min
                        </div>
                        <div className="font-semibold text-pink-600">
                          {formatPrice(Number(item.service.promoPrice || item.service.price))}
                        </div>
                      </div>

                      {/* Data e Horário */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Data</Label>
                          <Input
                            type="date"
                            value={item.selectedDate || ''}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) =>
                              updateSchedule(item.id, e.target.value, item.selectedTime || '')
                            }
                            className="h-8 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Horário</Label>
                          <Select
                            value={item.selectedTime || ''}
                            onValueChange={(value) =>
                              updateSchedule(item.id, item.selectedDate || '', value)
                            }
                          >
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue placeholder="Selecione" />
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
                      </div>

                      {(!item.selectedDate || !item.selectedTime) && (
                        <Alert className="bg-yellow-50 border-yellow-200">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <AlertDescription className="text-xs text-yellow-800">
                            Selecione data e horário para este serviço
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Quantidade e Remover */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cupom */}
                <div>
                  <Label>Cupom de Desconto</Label>
                  {coupon ? (
                    <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-800">{coupon}</span>
                          <Badge variant="secondary" className="bg-green-100">
                            {discount}% OFF
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeCoupon}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 flex gap-2">
                      <Input
                        placeholder="Digite o código"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      />
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon}
                        variant="outline"
                      >
                        Aplicar
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Valores */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  {discountValue > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Desconto</span>
                      <span className="text-green-600">- {formatPrice(discountValue)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-pink-600">{formatPrice(total)}</span>
                  </div>

                  <p className="text-xs text-gray-500">ou em até 3x de {formatPrice(total / 3)}</p>
                </div>

                <Separator />

                {/* Botões */}
                <div className="space-y-2">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    size="lg"
                  >
                    Finalizar Pedido
                  </Button>
                  <Button onClick={handleContinueShopping} variant="outline" className="w-full">
                    Continuar Comprando
                  </Button>
                </div>

                {/* Cupons disponíveis */}
                <div className="pt-4">
                  <p className="text-xs text-gray-500 mb-2">💡 Cupons disponíveis:</p>
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-xs">
                      PRIMEIRA10 - 10% off
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      BELEZA20 - 20% off
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      VIP30 - 30% off
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
