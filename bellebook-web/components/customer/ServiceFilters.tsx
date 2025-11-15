'use client';

import { useEffect, useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useServiceStore } from '@/store/service.store';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  icon?: string;
  servicesCount: number;
}

interface ServiceFiltersProps {
  categories: Category[];
  isMobile?: boolean;
}

export function ServiceFilters({ categories, isMobile = false }: ServiceFiltersProps) {
  const { filters, setFilters, resetFilters, hasActiveFilters } = useServiceStore();
  
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice || 0,
    filters.maxPrice || 500,
  ]);

  useEffect(() => {
    setPriceRange([filters.minPrice || 0, filters.maxPrice || 500]);
  }, [filters.minPrice, filters.maxPrice]);

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  const handlePriceCommit = () => {
    setFilters({
      minPrice: priceRange[0] === 0 ? undefined : priceRange[0],
      maxPrice: priceRange[1] === 500 ? undefined : priceRange[1],
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    setFilters({ category: categoryId === 'all' ? '' : categoryId });
  };

  const handleGenderChange = (gender: string) => {
    setFilters({ gender: gender as any });
  };

  const handleSortChange = (sort: string) => {
    setFilters({ sort: sort as any });
  };

  const handleReset = () => {
    resetFilters();
    setPriceRange([0, 500]);
  };

  const activeFiltersCount = [
    filters.category,
    filters.gender,
    filters.minPrice,
    filters.maxPrice !== 500 ? filters.maxPrice : undefined,
  ].filter(Boolean).length;

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Active Filters Count */}
      {hasActiveFilters() && (
        <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              {activeFiltersCount} {activeFiltersCount === 1 ? 'filtro ativo' : 'filtros ativos'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-auto p-1 text-blue-600 hover:text-blue-700"
          >
            Limpar
          </Button>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Categoria</Label>
        <RadioGroup
          value={filters.category || 'all'}
          onValueChange={handleCategoryChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2 rounded-md p-2 transition-colors hover:bg-gray-50">
            <RadioGroupItem value="all" id="cat-all" />
            <Label htmlFor="cat-all" className="flex-1 cursor-pointer font-normal">
              Todas as categorias
            </Label>
          </div>
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center space-x-2 rounded-md p-2 transition-colors hover:bg-gray-50"
            >
              <RadioGroupItem value={category.id} id={`cat-${category.id}`} />
              <Label
                htmlFor={`cat-${category.id}`}
                className="flex flex-1 cursor-pointer items-center justify-between font-normal"
              >
                <span className="flex items-center gap-2">
                  {category.icon && <span>{category.icon}</span>}
                  {category.name}
                </span>
                <Badge variant="secondary" className="ml-2">
                  {category.servicesCount}
                </Badge>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Gender Filter */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Gênero</Label>
        <RadioGroup value={filters.gender || ''} onValueChange={handleGenderChange} className="space-y-2">
          <div className="flex items-center space-x-2 rounded-md p-2 transition-colors hover:bg-gray-50">
            <RadioGroupItem value="" id="gender-all" />
            <Label htmlFor="gender-all" className="flex-1 cursor-pointer font-normal">
              Todos
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-md p-2 transition-colors hover:bg-gray-50">
            <RadioGroupItem value="FEMININO" id="gender-fem" />
            <Label htmlFor="gender-fem" className="flex-1 cursor-pointer font-normal">
              💁‍♀️ Feminino
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-md p-2 transition-colors hover:bg-gray-50">
            <RadioGroupItem value="MASCULINO" id="gender-masc" />
            <Label htmlFor="gender-masc" className="flex-1 cursor-pointer font-normal">
              🙋‍♂️ Masculino
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-md p-2 transition-colors hover:bg-gray-50">
            <RadioGroupItem value="UNISEX" id="gender-unisex" />
            <Label htmlFor="gender-unisex" className="flex-1 cursor-pointer font-normal">
              👥 Unissex
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Faixa de Preço</Label>
          <span className="text-sm text-gray-600">
            R$ {priceRange[0]} - R$ {priceRange[1]}
          </span>
        </div>
        <Slider
          min={0}
          max={500}
          step={10}
          value={priceRange}
          onValueChange={handlePriceChange}
          onValueCommit={handlePriceCommit}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>R$ 0</span>
          <span>R$ 500+</span>
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Ordenar por</Label>
        <Select value={filters.sort || 'popular'} onValueChange={handleSortChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">🔥 Mais Popular</SelectItem>
            <SelectItem value="newest">✨ Mais Recente</SelectItem>
            <SelectItem value="price-asc">💰 Menor Preço</SelectItem>
            <SelectItem value="price-desc">💎 Maior Preço</SelectItem>
            <SelectItem value="name">🔤 Nome A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  // Mobile: Render in Sheet
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge className="ml-1 bg-blue-600">{activeFiltersCount}</Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FiltersContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Render in sidebar
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Filtros</h2>
        {hasActiveFilters() && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-blue-600">
            <X className="mr-1 h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>
      <FiltersContent />
    </div>
  );
}
