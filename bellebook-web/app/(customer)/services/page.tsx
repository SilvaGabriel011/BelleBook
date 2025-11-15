'use client';

import { useEffect, useState } from 'react';
import { Search, Grid3x3, List, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ServiceCard } from '@/components/customer/ServiceCard';
import { useServiceStore } from '@/store/service.store';
import { getServices, getCategories } from '@/services/service.api';
import { useDebounce } from '@/hooks/use-debounce';

export default function ServicesPage() {
  const {
    services,
    filters,
    pagination,
    isLoading,
    viewMode,
    setServices,
    setFilters,
    setPagination,
    setLoading,
    setViewMode,
  } = useServiceStore();

  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch services when filters change
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await getServices(
          { ...filters, search: debouncedSearch },
          pagination.page,
          pagination.limit
        );
        setServices(response.data);
        setPagination(response.meta);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [filters, debouncedSearch, pagination.page, pagination.limit]);

  // Update search filter when debounced value changes
  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Nossos Serviços</h1>
          
          {/* Search and View Toggle */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar serviços..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block lg:w-80 lg:flex-shrink-0">
            <div className="sticky top-4">
              {/* Placeholder for ServiceFilters component */}
              <div className="rounded-lg border bg-white p-6">
                <h3 className="mb-4 text-lg font-bold">Filtros</h3>
                <p className="text-sm text-gray-600">
                  Componente de filtros será adicionado aqui
                </p>
              </div>
            </div>
          </aside>

          {/* Services Grid/List */}
          <main className="flex-1">
            {/* Results Count */}
            {!isLoading && (
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Mostrando <span className="font-semibold">{services.length}</span> de{' '}
                  <span className="font-semibold">{pagination.total}</span> serviços
                </p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className={viewMode === 'grid' 
                ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3' 
                : 'space-y-4'
              }>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {/* Services Grid */}
            {!isLoading && services.length > 0 && (
              <div className={viewMode === 'grid' 
                ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3' 
                : 'space-y-4'
              }>
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    variant={viewMode}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && services.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Nenhum serviço encontrado
                </h3>
                <p className="text-gray-600 mb-6 text-center max-w-md">
                  Não encontramos serviços que correspondam aos seus filtros.
                  Tente ajustar os filtros ou buscar por outro termo.
                </p>
                <Button onClick={() => setFilters({})}>
                  Limpar Filtros
                </Button>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && services.length > 0 && pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Anterior
                </Button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= pagination.page - 1 && page <= pagination.page + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={page === pagination.page ? 'default' : 'outline'}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  } else if (
                    page === pagination.page - 2 ||
                    page === pagination.page + 2
                  ) {
                    return <span key={page} className="px-2">...</span>;
                  }
                  return null;
                })}

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Próxima
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
